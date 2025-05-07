
import os
import fnmatch
import paramiko
import argparse
from stat import S_ISDIR, S_ISREG

# === CONFIGURATION ===
LOCAL_ROOT = r"C:\Users\bluev\Documents\blue-vistas.com"  # Change this if needed
REMOTE_ROOT = "public_html"
SFTP_HOST = "blue-vistas.com"
SFTP_PORT = 22
USERNAME = "gazpacho"
IGNORE_FILE = "publish.ignore"

# =======================

def load_ignore_patterns(ignore_file_path):
    patterns = set()
    if os.path.exists(ignore_file_path):
        with open(ignore_file_path, "r") as f:
            for line in f:
                line = line.strip().replace("\\", "/")
                if line and not line.startswith("#"):
                    patterns.add(line)
    return patterns

def should_ignore(path, ignore_patterns):
    normalized_path = path.replace('\\', '/')
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(normalized_path, pattern):
            return True
    return False

def get_sftp_connection(password):
    transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
    transport.connect(username=USERNAME, password=password)
    return paramiko.SFTPClient.from_transport(transport)

def ensure_remote_dirs(sftp, remote_path):
    dirs = []
    while len(remote_path) > 1:
        dirs.insert(0, remote_path)
        remote_path, _ = os.path.split(remote_path)
    for directory in dirs:
        try:
            sftp.stat(directory)
        except FileNotFoundError:
            sftp.mkdir(directory)

def remote_mtime(sftp, remote_path):
    try:
        attr = sftp.stat(remote_path)
        if S_ISREG(attr.st_mode):
            return attr.st_mtime
    except FileNotFoundError:
        return None
    return None

def sync_folder(local_dir, remote_dir, sftp, ignore_patterns):
    for root, dirs, files in os.walk(local_dir):
        rel_root = os.path.relpath(root, local_dir).replace('\\', '/')
        if rel_root == ".":
            rel_root = ""
        
        # Prune ignored directories
        dirs[:] = [
            d for d in dirs 
            if not should_ignore(os.path.join(rel_root, d).replace('\\', '/'), ignore_patterns)
        ]

        for file in files:
            relative_path = os.path.join(rel_root, file).replace('\\', '/')
            local_path = os.path.join(root, file)

            if should_ignore(relative_path, ignore_patterns):
                print("     Ignoring:", relative_path)
                continue

            remote_path = os.path.join(remote_dir, relative_path).replace('\\', '/')
            remote_dirname = os.path.dirname(remote_path)
            ensure_remote_dirs(sftp, remote_dirname)

            local_mtime = os.path.getmtime(local_path)
            r_mtime = remote_mtime(sftp, remote_path)

            if r_mtime is None:
                print("==> Uploading:", relative_path, "(NEW)")
                sftp.put(local_path, remote_path)
            elif local_mtime > r_mtime:
                print("==> Uploading:", relative_path, "(newer)")
                sftp.put(local_path, remote_path)
            else:
                print("     Skipping:", relative_path)

def main():
    parser = argparse.ArgumentParser(description="Sync local folder to remote via SFTP.")
    parser.add_argument("password", help="SFTP password")
    args = parser.parse_args()

    ignore_patterns = load_ignore_patterns(os.path.join(LOCAL_ROOT, IGNORE_FILE))
    sftp = get_sftp_connection(args.password)
    try:
        sync_folder(LOCAL_ROOT, REMOTE_ROOT, sftp, ignore_patterns)
    finally:
        sftp.close()

if __name__ == "__main__":
    main()

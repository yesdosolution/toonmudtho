import subprocess
import time
import os
import sys
import tempfile
import shutil

chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
temp_profile = tempfile.mkdtemp(prefix="chrome_qa_")

cmd = [
    chrome_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    f"--user-data-dir={temp_profile}",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:8080/"
]

print("Launching Chrome headless with CDP on port 9222...")
proc = subprocess.Popen(cmd)
time.sleep(2)

try:
    print("Running node scripts/run_qa_suite.js...")
    res = subprocess.run(["node", "scripts/run_qa_suite.js"], capture_output=True, text=True, encoding="utf-8")
    print("STDOUT:\n", res.stdout)
    if res.stderr:
        print("STDERR:\n", res.stderr)
    print("Exit code:", res.returncode)
finally:
    print("Terminating Chrome...")
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
    time.sleep(1)
    shutil.rmtree(temp_profile, ignore_errors=True)
    print("Chrome terminated and temp profile cleaned up.")

import subprocess
import time
import os
import sys

chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:8080/"
]

print("Launching Chrome headless with CDP...")
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
    proc.wait()
    print("Chrome terminated.")

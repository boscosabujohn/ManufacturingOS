import subprocess
import os
import sys

def test_layer_violation_canary():
    # The fixture project deliberately imports from packs into core
    # The linter should catch this and exit with a non-zero status code
    fixture_dir = os.path.join(os.path.dirname(__file__), 'fixture')
    
    # We must add the canary package to the python path to run lint-imports
    env = os.environ.copy()
    env['PYTHONPATH'] = os.path.dirname(__file__)
    
    lint_imports_bin = os.path.join(os.path.dirname(sys.executable), 'lint-imports')
    
    result = subprocess.run(
        [lint_imports_bin, '--config', '.importlinter'],
        cwd=fixture_dir,
        capture_output=True,
        text=True,
        env=env
    )
    
    # The linter should fail
    assert result.returncode != 0, f"Expected import linter to fail, but it passed. Output: {result.stdout}"

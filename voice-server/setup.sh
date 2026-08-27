#!/bin/bash
# Revox AI Voice Server Setup
# This sets up Python 3.11 + XTTS v2 for local voice cloning

echo "🎙️  Setting up Revox Voice Server..."
echo ""

# Check if pyenv is installed
if ! command -v pyenv &> /dev/null; then
    echo "Installing pyenv..."
    brew install pyenv
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
    echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
    echo 'eval "$(pyenv init -)"' >> ~/.zshrc
    export PYENV_ROOT="$HOME/.pyenv"
    export PATH="$PYENV_ROOT/bin:$PATH"
    eval "$(pyenv init -)"
fi

# Install Python 3.11 (compatible with ML libraries)
echo "Installing Python 3.11..."
pyenv install -s 3.11.9
pyenv local 3.11.9

# Create virtual environment
echo "Creating virtual environment..."
python -m venv .venv
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies (this may take a few minutes)..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the voice server:"
echo "  cd voice-server"
echo "  source .venv/bin/activate"
echo "  python server.py"
echo ""
echo "First run will download XTTS v2 (~2GB)."
echo "After that, it starts in seconds."

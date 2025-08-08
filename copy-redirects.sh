#!/bin/bash

# Script to copy redirection files for production builds
# This should be run after quarto render for production deployments

echo "Copying redirection files to _site directory..."

# Copy static files (redirection files)
if [ -d "static" ]; then
    cp -rnv static/. _site/
    echo "✓ Static files copied"
else
    echo "⚠ Static directory not found"
fi

# Copy moval.html
if [ -f "moval.html" ]; then
    cp -v moval.html _site/
    echo "✓ moval.html copied"
else
    echo "⚠ moval.html not found"
fi

echo "Redirection files copy complete!" 
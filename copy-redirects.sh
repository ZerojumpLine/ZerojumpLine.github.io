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

# Copy _redirects file
if [ -f "_redirects" ]; then
    cp -v _redirects _site/
    echo "✓ _redirects copied"
else
    echo "⚠ _redirects not found"
fi

# Create moval directory and index.html for directory-based redirect
mkdir -p _site/moval
cat > _site/moval/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting to MOVAL...</title>
    <meta http-equiv="refresh" content="0; url=https://zerojumpline.github.io/blog/2025-01-15-moval-estimating-performance/">
    <link rel="canonical" href="https://zerojumpline.github.io/blog/2025-01-15-moval-estimating-performance/">
</head>
<body>
    <p>Redirecting to <a href="https://zerojumpline.github.io/blog/2025-01-15-moval-estimating-performance/">MOVAL: Estimating Performance for Safe Deployment of Machine Learning Models</a>...</p>
    <script>
        window.location.href = "https://zerojumpline.github.io/blog/2025-01-15-moval-estimating-performance/";
    </script>
</body>
</html>
EOF
echo "✓ moval directory and index.html created"

echo "Redirection files copy complete!" 
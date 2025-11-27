#!/bin/bash

# Fix EventBus emit() calls that are passing object instead of (type, payload)
# Find all instances of emit({ and convert them

files=$(grep -r "eventBusService.emit({" src --include="*.ts" -l)

for file in $files; do
  echo "Processing $file..."
  
  # Use perl to fix the emit calls
  # This regex finds emit({ type: ..., ...rest }) and converts to emit(type, { ...rest })
 perl -i -pe 's/\.emit\(\{\s*type:\s*([^,]+),/\.emit($1, {/g' "$file"
done

echo "Done!"

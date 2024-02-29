#!/bin/bash

EnvFileName=".env.docker"
EnvOutputFile="/usr/share/nginx/html/env-config.js"

# Recreate config file
rm -rf $EnvOutputFile
touch $EnvOutputFile

# Add assignment 
echo "window.env = {" >> $EnvOutputFile

# Read each line in $EnvFileName file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from $EnvFileName file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> $EnvOutputFile
done < $EnvFileName

echo "}" >> $EnvOutputFile
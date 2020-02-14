rm -rf test
node moker.js create test
pushd test > /dev/null
node ../moker.js add server
popd > /dev/null
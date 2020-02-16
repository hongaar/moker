rm -rf test
node mokr.js create test
pushd test > /dev/null
node ../mokr.js add react-app --template cra
popd > /dev/null

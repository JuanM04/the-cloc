cd data/

echo "Generating a private key..."
openssl genrsa -des3 -out cert.key 2048
echo "Generating a CSR..."
openssl req -new -key cert.key -out cert.csr
echo "Removing Passphrase from key..."
cp cert.key cert.key.org
openssl rsa -in cert.key.org -out cert.key
echo "Generating a self-signed certificate..."
openssl x509 -req -days 9999 -in cert.csr -signkey cert.key -out cert.crt
echo "Finished!"

rm cert.csr cert.key.org
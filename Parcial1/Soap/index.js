const soap = require('soap');

const url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl';
const number = Number(process.argv[2] || 500);

if (!Number.isInteger(number) || number < 0 || number > 999999999) {
  console.error('Indica un numero entero entre 0 y 999999999.');
  process.exit(1);
}

soap.createClient(url, (clientError, client) => {
  if (clientError) {
    console.error('No se pudo cargar el WSDL:', clientError.message);
    process.exitCode = 1;
    return;
  }

  client.NumberToWords({ ubiNum: number }, (operationError, result) => {
    if (operationError) {
      console.error('Error al ejecutar NumberToWords:', operationError.message);
      process.exitCode = 1;
      return;
    }

    console.log(`Numero: ${number}`);
    console.log(`Resultado SOAP: ${result.NumberToWordsResult}`);
  });
});
 
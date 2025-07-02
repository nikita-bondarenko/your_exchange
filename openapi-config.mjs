
const config = {
  schemaFile: 'https://cryptus-2.0.1362967-ci52663.tw1.ru/swagger/?format=openapi',
  apiFile: './src/redux/api/emptyApi.ts',
  apiImport: 'emptyApi',
  outputFile: './src/redux/api/cryptusApi.ts',
  exportName: 'cryptusApi',
  hooks: true,
}

export default config

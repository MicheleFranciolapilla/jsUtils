module.exports = 
{
  preset                : 'ts-jest',
  testEnvironment       : 'node',
  transform             : {
                            '^.+\\.ts$' : [
                                            'ts-jest', 
                                            {
                                              tsconfig  : 'tsconfig.dev.json'
                                            }
                                          ]
    },
  
  testMatch             : ['**/__tests__/**/*.test.ts'],
  
  moduleFileExtensions  : ['ts', 'js', 'json']
};
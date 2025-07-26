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
  
  testMatch             : ['**/__tests__/**/*.test.js'],
  
  moduleFileExtensions  : ['ts', 'js', 'json']
};
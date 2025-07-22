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
  
  testMatch             : ['**/*.test.js'],
  
  moduleFileExtensions  : ['ts', 'js', 'json']
};
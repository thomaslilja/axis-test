/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'axis-test',
      removal: input.stage === 'prod' ? 'retain' : 'remove',
      protect: input.stage === 'prod',
      home: 'aws',
      providers: {
        aws: {
          region: 'eu-north-1',
          profile: process.env.GITHUB_ACTIONS ? undefined : 'tl-sandbox',
        },
      },
    };
  },
  async run() {
    /**
     * Secrets
     */
    const apiKey = new sst.Secret('API_KEY');

    /**
     * Functions
     */
    const basePath = 'src/functions';

    // Set the runtime and architecture for all functions
    $transform(sst.aws.Function, (fn) => {
      fn.runtime = 'nodejs22.x';
      fn.architecture = 'arm64';
    });

    const apiFunction = new sst.aws.Function('API', {
      handler: `${basePath}/api/index.handler`,
      environment: {
        GRAPHQL_API_URL:
          'https://xtrqc3d2xbctfkgkglturz4hym.appsync-api.eu-west-1.amazonaws.com/graphql',
      },
    });

    const authorizerFunction = new sst.aws.Function('Authorizer', {
      handler: `${basePath}/authorizer/index.handler`,
      link: [apiKey],
    });

    /**
     * API Gateway
     */
    const apiGateway = new sst.aws.ApiGatewayV2('Gateway', {
      cors: {
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['OPTIONS', 'GET', 'POST'],
      },
    });

    const authorizer = apiGateway.addAuthorizer({
      name: 'APIKeyAuthorizer',
      lambda: {
        function: authorizerFunction.arn,
        identitySources: ['$request.header.x-api-key'],
      },
    });

    apiGateway.route('$default', apiFunction.arn, {
      auth: {
        lambda: authorizer.id,
      },
    });
  },
});

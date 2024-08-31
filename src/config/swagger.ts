import swaggerJSDoc, { Options, SwaggerDefinition } from "swagger-jsdoc";
import path from "path";


const swaggerDefinition: SwaggerDefinition = {
    opeanapi: "3.0.1",
    info: {
        title: "The Writer Network International",
        version: "1.0.0",
        description: "The API server for the WNI platform"
    },
    servers: [
        {
            url: "http://localhost:4000"            
        },
    ]

};

const options: Options = {
    swaggerDefinition,
    apis: [path.join(__dirname, "../../docs/**/*.yaml")]
}


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
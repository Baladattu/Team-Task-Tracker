const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Team Task Tracker API',
            version: '1.0.0',
            description: 'API documentation for the Team Task Tracker project',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
            },
        ],
        components: {
            schemas: {
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        deadline: { type: 'string', format: 'date-time' },
                        project_id: { type: 'string', format: 'uuid' },
                        assigned_to: { type: 'string', format: 'uuid' },
                        parent_task_id: { type: 'string', format: 'uuid', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                NewTask: {
                    type: 'object',
                    required: ['title', 'project_id'],
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        deadline: { type: 'string', format: 'date-time' },
                        project_id: { type: 'string', format: 'uuid' },
                        assigned_to: { type: 'string', format: 'uuid' },
                        parent_task_id: { type: 'string', format: 'uuid' },
                    },
                },
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        owner_id: { type: 'string', format: 'uuid' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                NewProject: {
                    type: 'object',
                    required: ['name', 'owner_id'],
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        owner_id: { type: 'string', format: 'uuid' },
                    },
                },
                Attachment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        task_id: { type: 'string', format: 'uuid' },
                        uploaded_by: { type: 'string', format: 'uuid' },
                        file_name: { type: 'string' },
                        file_url: { type: 'string' },
                        uploaded_at: { type: 'string', format: 'date-time' },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        task_id: { type: 'string', format: 'uuid' },
                        author_id: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                NewComment: {
                    type: 'object',
                    required: ['task_id', 'author_id', 'content'],
                    properties: {
                        task_id: { type: 'string', format: 'uuid' },
                        author_id: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                    },
                },
            },
        }

    },
    apis: ['./routes/*.js'],
};


const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };

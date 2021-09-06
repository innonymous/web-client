
let backendHost = process.env.BACKEND_HOST || 'https://innonymous.tk/api/docs';
let backendPort = process.env.BACKEND_PORT || 8000;
let backendUrl = backendHost + ':' + backendPort;

module.exports = {
    backendHost: backendHost,
    backendPort: backendPort,
    backendUrl: backendUrl
}
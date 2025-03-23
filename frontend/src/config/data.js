
const APP_ENV = 'local'

let API_URL = ''



switch (APP_ENV) {
    case 'local':
        console.log('connecting to local')
        API_URL = 'http://localhost:8000'
        break;
    case 'prod':
        console.log('connecting to prod')
        API_URL = ''
        break;
    default:
        console.log('connecting to default api (local)')
        API_URL = 'http://localhost:8000'
        break;
}








export default API_URL;

const APP_ENV = 'prod'

let API_URL = ''



switch (APP_ENV) {
    case 'local':
        console.log('connecting to local')
        API_URL = 'http://localhost:8000'
        break;
    case 'prod':
        console.log('connecting to prod')
        API_URL = 'https://twitter-clone-fddo.onrender.com'
        break;
    default:
        console.log('connecting to default api (local)')
        API_URL = 'http://localhost:8000'
        break;
}








export default API_URL;
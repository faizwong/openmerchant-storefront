const developmentApiUrl = 'http://localhost:5000';
const productionApiUrl = 'http://localhost:5000';

const apiUrl = process.env.NODE_ENV === 'development' ? developmentApiUrl : productionApiUrl;
// const apiUrl = productionApiUrl;

export {
  apiUrl
};

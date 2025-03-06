const app = require('./app');
const resetCredits = require('./utils/resetCredits');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    resetCredits(); 
});
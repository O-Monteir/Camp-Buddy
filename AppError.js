//creating a custom error class
//it extends the actual error

class AppError extends Error{
    constructor(message,status){
        super();
        this.message = message;
        this.status = status;
        //the default error handler in express is looking for err.status
        //here we have defined it
    }
}

//export the class
module.exports = AppError;
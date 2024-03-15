class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)//override
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constuctor)
        }
    }
}

export {ApiError}
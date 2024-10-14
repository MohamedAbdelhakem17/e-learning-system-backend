const errorFormat = (array) => {
    const errors = array.reduce((acc, error) => {
        acc[error.path] = (acc[error.path] || []).concat(error.msg)
        console.log(error.msg)
        return acc
    }, {})
    return errors
}

module.exports = errorFormat

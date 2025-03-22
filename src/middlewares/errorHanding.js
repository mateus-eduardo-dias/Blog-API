export default (err, req, res, next) => {
    res.statusCode = err.statusCode
    if (err.expected) {
        res.send(JSON.stringify({
            'message': err.info,
            'code': err.code
        }))
    } else {
        console.warn(`Unknown error names ${err.info} with code ${err.code}`)
        res.send(JSON.stringify({
            'message': 'Unknown error happened',
            'code': err.code
        }))
    }
    next()
}
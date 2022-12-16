/**
 * @api {post} /auth/sign-up Sign up
 * @apiGroup Auth
 * @apiName signUp
 * @apiDescription Customer registration with fill customer profile. For all stages.
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Body) {String} email                     ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 * @apiParam (Body) {String} password                  ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~\"\']{4,27}$
 * @apiParam (Body) {String} zipCode                   [0-9]{5}
 * @apiParam (Body) {String} name                      ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String} surname                   ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String} phoneNumber               ^(\+?[0-9]{10,14})$
 * @apiParam (Body) {String} workPhoneNumber           ^(\+?[0-9]{10,14})$
 * @apiParam (Body) {String} homeAddress               ^[A-Za-z0-9,.]{3,37}$
 * @apiParam (Body) {Object} homePosition
 * @apiParam (Body) {Number} homePosition.lat
 * @apiParam (Body) {Number} homePosition.long
 * @apiParam (Body) {String} billingAddress            ^[A-Za-z0-9,.]{3,37}$
 * @apiParam (Body) {String} city                      ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String} state                     ^[A-Za-z]{2,27}$
 * @apiParam (Body) {Object[]} emergencies
 * @apiParam (Body) {String} emergencies.name
 * @apiParam (Body) {String} emergencies.phoneNumber
 * @apiParam (Body) {String} [lockboxDoorCode]           ^[0-9*#]{2,27}$
 * @apiParam (Body) {String} [lockboxLocation]           ^[A-Z a-z]{2,27}$
 * @apiParam (Body) {String} homeAlarmSystem           ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String} otherHomeAccessNotes      ^[A-Za-z]{2,37}$
 * @apiParam (Body) {String} otherRequestNotes        ^[A-Za-z0-9,.!?#$%&*\(\)-_+=\/\|\\\“\”\"\‘\'\«\»\@\~\`]{2,37}$
 * @apiParam (Body) {String} mailbox                   ^[A-Za-z0-9,.]{2,27}$
 * @apiParam (Body) {Boolean} isMailKeyProvided
 * @apiParam (Body) {Boolean} isTurnLight
 * @apiParam (Body) {Boolean} isSomeoneWillBeAtHome
 * @apiParam (Body) {Boolean} isWaterPlantsExists
 * @apiParam (Body) {String} comment                   ^[A-Za-z,.!?#$\%\&\*\(\)-_+=\/\|\\\“\”\‘\«\»\@~\"\'\`]{2,37}$
 * @apiParam (Body) {String="thumbstack", "google", "yelp", "friend", "instagram", "care", "facebook", "other"} hearAboutUs
 * @apiParam (Body) {String[]="monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"} garbage
 *
 *
 * @apiSuccess {Object}                           response
 * @apiSuccess {String}                           response.accessToken                Customer access token
 * @apiSuccess {Number}                           response.accessExpiredAt            Customer access token expiration
 * @apiSuccess {String}                           response.refreshToken               Customer refresh token
 * @apiSuccess {Number}                           response.refreshExpiredAt           Customer refresh token expiration
 *
 */


/**
 * @api {post} /auth/sign-in Sign In
 * @apiGroup Auth
 * @apiName signIn
 * @apiDescription Sign in for customer and employee.
 * Client-side can identificate user's role help with `response.role`.
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Body) {String} email                    ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 * @apiParam (Body) {String} password                 ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~\"\']{4,27}$
 *
 * @apiSuccess {Object}                           response
 * @apiSuccess {String}                           response.accessToken                Customer access token
 * @apiSuccess {Number}                           response.accessExpiredAt            Customer access token expiration
 * @apiSuccess {String}                           response.refreshToken               Customer refresh token
 * @apiSuccess {String="employee", "customer"}    response.role
 * 
 */


/**
 * @api {post} /auth/refresh Refresh access token
 * @apiGroup Auth
 * @apiName refreshToken
 * @apiDescription Use this method when calling other authorized methods throws 401 error
 *
 * @apiParam (Body) accessToken old access token
 *
 * @apiError (401) {String} Unauthorized If token is broken or user was not found
 *
 * @apiSuccess {Object}                           response
 * @apiSuccess {String}                           response.accessToken                Customer access token
 * @apiSuccess {Number}                           response.accessExpiredAt            Customer access token expiration
 * @apiSuccess {String}                           response.refreshToken               Customer refresh token
 * @apiSuccess {Number}                           response.refreshExpiredAt           Customer refresh token expiration
 * @apiSuccess {String="employee", "customer"}    response.role
 *
 */


/**
 * @api {get} /auth/forgot-password Forgot password
 * @apiGroup Auth
 * @apiName forgotPassword
 * @apiDescription Send letter with deep link to existed user's email
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Query) {String} email                   ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 *
 * @apiSuccess {Object} response
 * @apiSuccess {Boolean=true} response.success
 */


/**
 * @api {post} /auth/forgot-password/change Change password by forgot request
 * @apiName passwordChange
 * @apiGroup Auth
 * @apiDescription Change user's password by forgot password code
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Body) {String} code                     uuid code which was sended to email on forgot password request
 * @apiParam (Body) {String} newPassword              ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~\"\']{4,27}$
 *
 * @apiSuccess {Object} response
 * @apiSuccess {Boolean=true} response.success
 */


/**
 * @api {get} /auth/email/check Check email
 * @apiGroup Auth
 * @apiName checkEmail
 * @apiDescription Route for checking user exist by email
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Query) {String} email                   ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 *
 * @apiSuccess {Object} response
 * @apiSuccess {Boolean} response.isExist
 */


/**
 * @api {get} /auth/zip-code/check Check zip code
 * @apiGroup Auth
 * @apiName checkZipCode
 * @apiDescription Route for checking zip-code exist
 *
 * @apiHeader Content-Type (application/json)
 *
 * @apiParam (Query) {String} zipCode                 ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 *
 * @apiSuccess {Object} response
 * @apiSuccess {Boolean} response.isExist
 */

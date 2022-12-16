/**
 * @apiGroup Customer Pets
 * @api {get} /customer/pets/all Get my all pets
 * @apiName getAll
 * @apiDescription Get all: dogs, cats and small animals
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Query) {Number}                                     [limit=10]
 * @apiParam (Query) {Number}                                     [page=1]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String}                                           response.items.name
 * @apiSuccess {String}                                           response.items.breed
 * @apiSuccess {String="male", "female"}                          response.items.gender
 * @apiSuccess {String}                                           [response.items.imageUrl]
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {put} /customer/pets/dog Add dog
 * @apiName addDog
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="dog"}                                speciesType
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {Number{1-100}}                               size
 * @apiParam (Body) {String="small", "medium", "large"}           sizeType
 * @apiParam (Body) {Number{0..20}}                               [age]
 * @apiParam (Body) {String}                                      [breed]
 * @apiParam (Body) {String}                                      [feedingInstructions]
 * @apiParam (Body) {String}                                      [medicationInstructions]
 * @apiParam (Body) {Boolean}                                     [isSpayed]
 * @apiParam (Body) {String[]}                                    [onWalksActions]
 * @apiParam (Body) {String[]}                                    [onSomeoneEntryActions]
 * @apiParam (Body) {Boolean}                                     [hasMedication]
 * @apiParam (Body) {String}                                      [medicalRequirements]
 * @apiParam (Body) {String}                                      [medicalNotes]
 * @apiParam (Body) {Boolean}                                     [isDoggyDoorExists]
 * @apiParam (Body) {Object[]}                                    [veterinarians]
 * @apiParam (Body) {String}                                      [veterinarians].name
 * @apiParam (Body) {String}                                      [veterinarians].phoneNumber
 * @apiParam (Body) {String="friendly", "shy"}                    [character]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {put} /customer/pets/cat Add cat
 * @apiName addCat
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="cat"}                                speciesType
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {Number{0..20}}                               [age]
 * @apiParam (Body) {String}                                      [breed]
 * @apiParam (Body) {String}                                      [feedingInstructions]
 * @apiParam (Body) {String}                                      [medicationInstructions]
 * @apiParam (Body) {Boolean}                                     [isSpayed]
 * @apiParam (Body) {Boolean}                                     [hasMedication]
 * @apiParam (Body) {String}                                      [medicalRequirements]
 * @apiParam (Body) {String}                                      [medicalNotes]
 * @apiParam (Body) {String}                                      [locationOfLitterbox]
 * @apiParam (Body) {Object[]}                                    [veterinarians]
 * @apiParam (Body) {String}                                      [veterinarians].name
 * @apiParam (Body) {String}                                      [veterinarians].phoneNumber
 * @apiParam (Body) {String="friendly", "shy"}                    [character]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {put} /customer/pets/small-animal Add small-animal
 * @apiName addSmallAnimal
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="small-animal"}                       speciesType
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {String}                                      [breed]
 * @apiParam (Body) {String}                                      [medicalNotes]
 * @apiParam (Body) {Object[]}                                    [veterinarians]
 * @apiParam (Body) {String}                                      veterinarians.name
 * @apiParam (Body) {String}                                      veterinarians.phoneNumber
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {get} /customer/pets/profile/:petId Get pet profile
 * @apiName getPetInfo
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    petId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {String}                                           response.name
 * @apiSuccess {String="dog", "cat", "small-animal"}              response.speciesType
 * @apiSuccess {String}                                          [response.imageUrl]
 * @apiSuccess {String}                                          [response.breed]
 * @apiSuccess {String="male", "female"}                          response.gender
 * @apiSuccess {Number}                                          [response.age]
 * @apiSuccess {Number}                                          [response.size]
 * @apiSuccess {String="small", "medium", "large"}               [response.sizeType]
 * @apiSuccess {String}                                          [response.feedingInstructions]
 * @apiSuccess {String[]}                                        [response.onWalks]
 * @apiSuccess {String[]}                                        [response.onSomeoneEntry]
 * @apiSuccess {String}                                          [response.medicationInstructions]
 * @apiSuccess {Boolean}                                         [response.isSprayed]
 * @apiSuccess {Boolean}                                         [response.hasMedication]
 * @apiSuccess {String}                                          [response.medicalRequirements]
 * @apiSuccess {String}                                          [response.medicalNotes]
 * 
 * @apiSuccess {Object}                                           response.veterinarian
 * @apiSuccess {String}                                           response.veterinarian.id
 * @apiSuccess {String}                                           response.veterinarian.name
 * @apiSuccess {String}                                           response.veterinarian.phoneNumber
 * 
 * @apiSuccess {Boolean}                                         [response.isDoggyDoorExists]
 * @apiSuccess {String="shy", "friendly"}                        [response.character]
 * @apiSuccess {String}                                          [response.locationOfLitterbox]
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {patch} /customer/pets/dog/:dogId Edit dog
 * @apiName editDog
 * @apiDescription Edit dog variables with veterinarian update
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    dogId
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {Number}                                      age                     max-20 min-0
 * @apiParam (Body) {Number{1-100}}                               size
 * @apiParam (Body) {String="small", "medium", "large"}           sizeType
 * @apiParam (Body) {String}                                     [breed]
 * @apiParam (Body) {String}                                     [feedingInstructions]
 * @apiParam (Body) {String}                                     [medicationInstructions]
 * @apiParam (Body) {Boolean}                                    [isSpayed]
 * @apiParam (Body) {String[]}                                   [onWalksActions]
 * @apiParam (Body) {String[]}                                   [onSomeoneEntryActions]
 * @apiParam (Body) {Boolean}                                    [hasMedication]
 * @apiParam (Body) {String}                                     [medicalRequirements]
 * @apiParam (Body) {String}                                     [medicalNotes]
 * @apiParam (Body) {Boolean}                                    [isDoggyDoorExists]
 * @apiParam (Body) {Object[]}                                   [veterinarians]
 * @apiParam (Body) {String}                                      veterinarians.id
 * @apiParam (Body) {String}                                      veterinarians.name
 * @apiParam (Body) {String}                                      veterinarians.phoneNumber
 * @apiParam (Body) {String="friendly", "shy"}                   [character]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {patch} /customer/pets/cat/:catId Edit cat
 * @apiName editCat
 * @apiDescription Edit cat variables with veterinarian update
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    catId
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {Number}                                     [age]
 * @apiParam (Body) {String}                                     [breed]
 * @apiParam (Body) {String}                                     [feedingInstructions]
 * @apiParam (Body) {String}                                     [medicationInstructions]
 * @apiParam (Body) {Boolean}                                    [isSpayed]
 * @apiParam (Body) {Boolean}                                    [hasMedication]
 * @apiParam (Body) {String}                                     [medicalRequirements]
 * @apiParam (Body) {String}                                     [medicalNotes]
 * @apiParam (Body) {String}                                     [locationOfLitterbox]
 * @apiParam (Body) {Object[]}                                   [veterinarians]
 * @apiParam (Body) {String}                                      veterinarians.id
 * @apiParam (Body) {String}                                      veterinarians.name
 * @apiParam (Body) {String}                                      veterinarians.phoneNumber
 * @apiParam (Body) {String="friendly", "shy"}                    character
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {patch} /customer/pets/small-animal/:petId Edit small-animal
 * @apiName editSmallAnimal
 * @apiDescription Edit small animal variables with veterinarian update
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    petId
 *
 * @apiParam (Body) {String}                                      name
 * @apiParam (Body) {String="male", "female"}                     gender
 * @apiParam (Body) {String}                                     [breed
 * @apiParam (Body) {String}                                     [medicalNotes]
 * @apiParam (Body) {Object[]}                                   [veterinarians]
 * @apiParam (Body) {String}                                      veterinarians.id
 * @apiParam (Body) {String}                                      veterinarians.name
 * @apiParam (Body) {String}                                      veterinarians.phoneNumber
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {post} /customer/pets/:petId/avatar Attach avatar to animal
 * @apiName setPetAvatar
 * @apiDescription Set avatar to animal.
 * Send request by multipart/form-data content-type.
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 * 
 * 
 * @apiParam (Params) {String}                                    petId
 *
 * @apiParam (Form) {String}                                      avatar
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {get} /customer/pets/:petId/vaccinations Get vaccinations
 * @apiName getVaccinations
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    petId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String}                                           response.items.imageUrl
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {post} /customer/pets/:petId/vaccinations Attach vaccination to animal
 * @apiName setVaccination
 * @apiDescription Send request by multipart/form-data content-type.
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    petId
 *
 * @apiParam (Form) {String}                                      vaccinations         max count - 10 files
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {delete} /customer/pets/:petId/vaccinations/:vaccinationId Delete vaccination
 * @apiName deleteVaccination
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    petId
 * @apiParam (Params) {String}                                    vaccinationId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {post} /customer/pets/for-order Get pets for creating new order
 * @apiName getPetsForOrder
 * @apiDescription Return allowed pets for creating new order
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 * 
 *
 * @apiParam (Body) {String}                                      serviceId
 * @apiParam (Body) {Number[]}                                    onDates
 * @apiParam (Body) {Object[]}                                    visits
 * @apiParam (Body) {String="morning", "afternoon", "evening"}    visits.type
 * @apiParam (Body) {Number{0-86399000}}                          visits.time
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String}                                           response.items.name
 * @apiSuccess {String}                                           response.items.breed
 * @apiSuccess {String}                                           [response.items.imageUrl]
 * 
 */


/**
 * @apiGroup Customer Pets
 * @api {delete} /customer/pets/:petId Delete pet
 * @apiName deletePet
 * 
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    petId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 * 
 */

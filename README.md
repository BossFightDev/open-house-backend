# API documentation
`webURL: "https://openhousebackend.herokuapp.com/api"`

## Listings
`GET '/listings'`
  Gets the property listings
#### Parameters
`None`
#### Return value
a list of properties inside `{properties}`

## User
`POST '/user'`
creates a user POST
#### Parameters
`( firstName, lastName, username, password, phoneNumber, company )`
#### Return value
`None`

## Photo
`POST '/photo'`
adds a photo to a property listing
#### Parameters
`(MLS)`
#### Return value
cloudinary upload info in `{result}`

## Property
`POST '/property'`
creates a new property
#### Parameters
`( address, beds, baths, sqft, price )`
#### Return value
  `None`

## Property Picture
`POST '/propertypic'`
finds all of the given uri's for a property's pictures
#### Parameters
`(MLS)`
#### Return value
`{images}` an array of  uri strings

## NewOpenHouse
`POST '/newOpenHouse'`
creates a new open house
#### Parameters
the q properties are booleans that relate to the render method
``` 
    ( MLS, date, image, phoneQ,
    agentQ, sourceQ, imageQ,
    priceQ, bedbathQ, sqftq,
    hashtagQ, hashtags ) 
```
#### Return value
the new openhouse `{openHouse}`

## AddLead
`POST '/addlead'`
creates a new lead
#### Parameters
``` 
    ( openHouseId, name, email, phone, agent, source  ) 
```
#### Return value
`None`

## ListOpenHouses
`POST '/openhouses'`
lists the users past open houses
#### Parameters
`(userId)`
#### Return value
a list of the past open houses in `{openHouses}`

## ListLeads
`POST '/leads'`
lists the open house's leads
#### Parameters
`(openHouseId)`
#### Return value
a list of the past open house's leads in `{ leads }`


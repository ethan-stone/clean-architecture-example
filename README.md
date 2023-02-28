# Description

Right now every service in the core services is doing things differently in regard to how they interact with the database, how they validate data, how they handle errors, and how they return HTTP responses. To allow us to develop features faster and allow members of the team to understand services they have never worked on faster, we should standardize the structure of our code and come up with some internal “best practices”.

# Clean Architecture

While we tease Ran a lot about his crazy design patterns, they do have some merit to them and I think we should embrace some ideas. Specifically, the idea of defining interfaces, and then our business logic uses those interfaces. If you are familiar with the [Design Patterns](https://www.youtube.com/watch?v=WQ8bNdxREHU) book, then the pattern that best fits this approach is the Strategy Pattern. You can find a good video of it [here](https://www.youtube.com/watch?v=WQ8bNdxREHU).

Again I am not saying we blindly follow the Strategy Pattern, but we can definitely embrace some principles of it. We have already done this in the `asset-management` service, but I think we should continue to improve, and also refactor the other services.

This repo uses the example of subscribing a user to an email newsletter. Suppose there is some frontend with two inputs, one for the users name and one for the users email, and then a button to send a request an api endpoint powered by AWS APIGateway and Lambda Integrations (much like our core services). The entrypoint for the lambda function that is triggered is in `services/subscribeUser/handler.ts`. It parses the request body using zod, and if it fails returns a `badRequest`. If it succeeds it calls a function called `subscribeUser` the email and name, as well as `insertUser` and `sendEmail`.

Inside of `subscribeUser`, it calls `insertUser` with the passed in email and name and a uuid, and it calls `sendEmail` with the appropriate arguments. This is where our `business logic` happens.

Notice how in `subscribeUser` we do not directly import functions for `insertUser` and `sendEmail`. Instead they are defined in the parameters of the function in the `ctx` object as types `InsertUserFn` and `SendEmailFn`. Now, why do this rather than just importing the functions at the top and using them? There are two reasons.

The first is that by defining an interface for these functions and making the caller of `subscribeUser` pass them in, we are forcing a strict contract of what `subscribeUser` needs in order to work, and it is up to the caller to implement a function that adheres to that contract. The implementation can change without the business logic needing to change. For example if we switch from SES so SendGrid in this example.

The second is that this is way more testable. If we were to just import and use the implementation of `insertUser` and `sendEmail` we would have to test it like we did in `asset-management` service, and create spys and mocks of these files. We can simply create a fake function that returns some fake data that adheres to the interface and pass it in.

<img width="598" alt="image" src="https://user-images.githubusercontent.com/46607985/221945133-fe74e582-6070-4eed-8240-89fa7ca7fc51.png">

# Unit Testing

If you look at our services, you'll notice we usually make a `__tests__` folder for each service that mirrors the structure of the source code. This is fine but to me I think there is a better way. The purpose of unit tests is to test the smallest possible unit of code. So to me it makes sense to put the unit test right next to the unit of code it is supposed to be testing.

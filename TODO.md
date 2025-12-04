I think we should have components that requests for certain props like user={ id: string } etc.
then we have a wrapper for that props inside the _components/ folder that uses the preloadedQuery hook to get the data and pass it to the component.
This way we make sure the components are only for render purposes and not for data manipulation.

I'm not sure if that make sense with the features/ folder structure. We need to discuss this with an ai.

Then we need to see if we'd like to make smaller convex queries, so some are fetched from the server and some from the client (for real-time data like players list).
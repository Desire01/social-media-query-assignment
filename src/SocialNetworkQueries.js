export class SocialNetworkQueries {
  constructor({ fetchCurrentUser }) {
    //YOUR CODE HERE
    this.fetchCurrentUser = fetchCurrentUser;
    this.lastKnownUserData = null;
  }
  //YOUR CODE HERE
  async findPotentialLikes(minimalScore) {
    try {
      //Fetching user data form the function fetchCurrentUser and save the data
      const userData = await this.fetchCurrentUser();
      this.lastKnownUserData = userData;

      //checking for required fields in the user data
      if (!userData || !userData.friends || !userData.likes) {
        return [];
      }
      //creating a set with the books liked by current user & a map to store the potential like + counts
      const userLikesSet = new Set(userData.likes);
      const potentialLikesMap = new Map();

      //iterating over the friends in the user data
      userData.friends.forEach((friend) => {
        if (friend.likes && friend.likes.length > 0) {
          //set containing unique books liked by friend minus those liked 
          const uniqueFriendsLikes = new Set(friend.likes.filter((like) => !userLikesSet.has(like)));
          //Iterate over the unique books
          uniqueFriendsLikes.forEach((friendLike) => {
            
            //update the potentiallikesmap with the ocunt of each unique
            potentialLikesMap.set(
              friendLike, (potentialLikesMap.get(friendLike) || 0) + 1
            );
          }); 
        }
      });

      //Calculating the total number of friends and create an array of potential likes based on the map
      const totalFriends = userData.friends.length;

      const potentialLikes = Array.from(potentialLikesMap.entries())
      .filter(([title, count]) => count / totalFriends >= minimalScore)
      .sort((a, b) => {
        //sorting the potential likes by count in descending order
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        //sort alphabetically if the counts are the same
        return a[0].localCompare(b[0], "en", { sensitivity: "base"});
      })
      .map(([title]) => title);
      return potentialLikes;
    } 
  }
}

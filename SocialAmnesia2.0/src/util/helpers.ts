/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-param-reassign */
import store from "@/store/index";
import constants from "@/store/constants";
import axios, { AxiosResponse } from "axios";

const twitterGatherAndSetItems = ({
  maxId,
  apiRoute,
  itemArray,
  oldestItem
}: {
  maxId: number;
  apiRoute: string;
  itemArray: { id: number }[];
  oldestItem: number;
}) => {
  const data = {
    tweet_mode: "extended",
    user_id: store.state.twitter[constants.TWITTER_USER_ID],
    // can only do 200 per request, so we need to continually make requests until we run out of items
    count: 200
  };
  if (maxId) {
    // @ts-ignore
    data.max_id = String(maxId);
  }
  store.state.twitter[constants.TWITTER_USER_CLIENT]
    .get(apiRoute, data)
    .then((items: any) => {
      if (
        items.length === 0 ||
        (items.length === 1 && items[0].id === oldestItem)
      ) {
        if (apiRoute === constants.TWEETS_ROUTE) {
          store.dispatch(constants.UPDATE_USER_TWEETS, itemArray);
        }
        if (apiRoute === constants.FAVORITES_ROUTE) {
          store.dispatch(constants.UPDATE_USER_FAVORITES, itemArray);
        }
        return;
      }

      itemArray = itemArray.concat(items);
      oldestItem = itemArray.slice(-1)[0].id;

      twitterGatherAndSetItems({
        maxId: oldestItem,
        apiRoute,
        itemArray,
        oldestItem
      });
    });
};

const makeRedditGetRequest = async (url: string): Promise<any> => {
  try {
    const { data }: AxiosResponse = await axios.get(url, {
      headers: {
        Authorization: `bearer ${
          store.state.reddit[constants.REDDIT_ACCESS_TOKEN]
        }`
      }
    });
    return data;
  } catch (error) {
    console.error(`Error in reddit request ${url}`, error);
    return error;
  }
};

const redditGatherAndSetItems = () => {
  makeRedditGetRequest(
    `https://oauth.reddit.com/user/${
      store.state.reddit[constants.REDDIT_USER_NAME]
    }/comments`
  ).then(commentsData => {
    console.log("comments Data", commentsData);

    store.dispatch(
      constants.UPDATE_REDDIT_COMMENTS,
      commentsData.data.children
    );

    console.log(store.state.reddit[constants.REDDIT_COMMENTS]);
  });

  makeRedditGetRequest(
    `https://oauth.reddit.com/user/${
      store.state.reddit[constants.REDDIT_USER_NAME]
    }/submitted`
  ).then(submissionData => {
    console.log("submission Data", submissionData);

    store.dispatch(constants.UPDATE_REDDIT_POSTS, submissionData.data.children);

    console.log(store.state.reddit[constants.REDDIT_POSTS]);
  });
};

const helpers = {
  twitterGatherAndSetItems,
  makeRedditGetRequest,
  redditGatherAndSetItems
};

export default helpers;

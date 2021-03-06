import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import {
  canListingBeChallenged,
  // canBeWhitelisted,
  // canResolveChallenge,
  // isAwaitingAppealJudgment,
  isInApplicationPhase,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  ListingWrapper,
  UserChallengeData,
  WrappedChallengeData,
} from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent } from "@joincivil/components";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom: NewsroomState | undefined;
  listing: ListingWrapper | undefined;
  challenge?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const { listingAddress: address, listing, newsroom } = this.props;
    const newsroomData = newsroom!.wrapper.data;
    const listingData = listing && listing.data;
    const description =
      "This will be a great description someday, but until then The Dude Abides. um i to you you call duder or so thats the dude thats what i am brevity thing um i let me duder or";
    const listingDetailURL = `/listing/${address}`;
    const isInApplication = listingData && isInApplicationPhase(listingData);
    const canBeChallenged = listingData && canListingBeChallenged(listingData);
    const inChallengePhase = listingData && listingData.challenge && isChallengeInCommitStage(listingData.challenge);
    const inRevealPhase = listing && listing.data.challenge && isChallengeInRevealStage(listing.data.challenge);
    const appExpiry = listingData && listingData.appExpiry && listingData.appExpiry.toNumber();

    const pollData = listingData && listingData!.challenge && listingData!.challenge!.poll;
    const commitEndDate = pollData && pollData!.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData!.revealEndDate.toNumber();

    const listingViewProps = {
      ...newsroomData,
      address,
      description,
      listingDetailURL,
      isInApplication,
      canBeChallenged,
      inChallengePhase,
      inRevealPhase,
      appExpiry,
      commitEndDate,
      revealEndDate,
    };

    return <ListingSummaryComponent {...listingViewProps} />;
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { newsrooms, listings, challenges, challengeUserData, user } = state;

  let listingAddress = ownProps.listingAddress;
  let challenge;
  if (!listingAddress && ownProps.challengeID) {
    challenge = challenges.get(ownProps.challengeID);
    listingAddress = challenges.get(ownProps.challengeID)!.listingAddress;
  }

  const newsroom = newsrooms.get(listingAddress!);
  const listing = listings.get(listingAddress!) ? listings.get(listingAddress!).listing : undefined;

  let challengeID = ownProps.challengeID;
  if (!challengeID && listing) {
    challengeID = listing.data.challengeID!.toString();
  }

  let userAcct = ownProps.user;
  if (!userAcct) {
    userAcct = user.account.account;
  }

  let userChallengeData;
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!);
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct);
    }
  }

  return {
    newsroom,
    listing,
    challenge,
    userChallengeData,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);

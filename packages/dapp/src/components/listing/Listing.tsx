import * as React from "react";

import ChallengeHistory from "./ChallengeHistory";
import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import ListingPhaseActions from "./ListingPhaseActions";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { State } from "../../reducers";
import { connect, DispatchProp } from "react-redux";
import { PageView } from "../utility/ViewModules";

export interface ListingPageProps {
  match: any;
}

export interface ListingReduxProps {
  newsroom: NewsroomWrapper | undefined;
  listing: ListingWrapper | undefined;
  userAccount?: EthAddress;
}

class ListingPage extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageProps> {
  public render(): JSX.Element {
    const listing = this.props.listing;
    const newsroom = this.props.newsroom;
    let appExistsAsNewsroom = false;
    if (listing && newsroom) {
      appExistsAsNewsroom = !listing.data.appExpiry.isZero();
    }
    return (
      <PageView>
        {appExistsAsNewsroom && (
          <ListingDetail userAccount={this.props.userAccount} listing={listing!} newsroom={newsroom!} />
        )}
        {appExistsAsNewsroom && <ListingPhaseActions listing={this.props.listing!} />}
        {!appExistsAsNewsroom && this.renderListingNotFound()}
        <ChallengeHistory listing={this.props.match.params.listing} />
        <ListingHistory listing={this.props.match.params.listing} />
      </PageView>
    );
  }

  private renderListingNotFound(): JSX.Element {
    return <>NOT FOUND</>;
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingReduxProps => {
  const { newsrooms, listings, user } = state;
  const listing = ownProps.match.params.listing;
  return {
    newsroom: newsrooms.get(listing),
    listing: listings.get(listing) ? listings.get(listing).listing : undefined,
    userAccount: user.account,
  };
};

export default connect(mapToStateToProps)(ListingPage);

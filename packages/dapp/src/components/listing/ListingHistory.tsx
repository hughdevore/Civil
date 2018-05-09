import * as React from "react";
import { List } from "immutable";
import { Subscription } from "rxjs";

import ListingEvent from "./ListingEvent";
import { getTCR } from "../../helpers/civilInstance";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

export interface ListingHistoryProps {
  match: any;
}

export interface ListingHistoryState {
  listingHistory: List<any>;
  compositeSubscription: Subscription;
  error: undefined | string;
}

class ListingHistory extends React.Component<ListingHistoryProps, ListingHistoryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      listingHistory: List<any>(),
      compositeSubscription: new Subscription(),
      error: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initHistory();
  }

  public componentWillUnmount(): void {
    this.state.compositeSubscription.unsubscribe();
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Listing History</ViewModuleHeader>
        {this.state.listingHistory.map(e => {
          return <ListingEvent key={this.props.match.params.listing + e.blockNumber} event={e} />;
        })}
      </ViewModule>
    );
  }

  private handleSubscriptionReturn = async (event: any) => {
    const timestamp = await event.timestamp();
    const newHistory = this.state.listingHistory.push({ ...event, timestamp });
    this.setState({ listingHistory: newHistory.sort((a, b) => b.blockNumber - a.blockNumber).toList() });
  };

  // TODO(nickreynolds): move this all into redux
  private initHistory = async () => {
    const tcr = getTCR();

    if (tcr) {
      const listingHelper = tcr.getListing(this.props.match.params.listing);
      const subscription = listingHelper.compositeObservables().subscribe(this.handleSubscriptionReturn);
      this.setState({ compositeSubscription: subscription });
    }
  };
}

export default ListingHistory;

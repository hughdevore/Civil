import * as React from "react";
import styled from "styled-components";
import { CivilTCR } from "@joincivil/core";
import { Link } from "react-router-dom";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingEventProps {
  event: any;
  listing: string;
}

class ListingEvent extends React.Component<ListingEventProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const wrappedEvent = this.props.event as
      | CivilTCR.LogEvents._Application
      | CivilTCR.LogEvents._ApplicationWhitelisted
      | CivilTCR.LogEvents._Challenge;
    let argsData: JSX.Element | null = null;
    switch (wrappedEvent.event) {
      case CivilTCR.Events._Application:
        argsData = this.renderApplicationEvent(wrappedEvent.args);
        break;
      case CivilTCR.Events._ApplicationWhitelisted:
        argsData = this.renderNewListingWhitelistedEvent(wrappedEvent.args as CivilTCR.Args._ApplicationWhitelisted);
        break;
      case CivilTCR.Events._Challenge:
        argsData = this.renderChallengeEvent(wrappedEvent.args as CivilTCR.Args._Challenge);
        break;
      default:
        argsData = this.renderUnsupportedEvent(wrappedEvent);
    }

    return (
      <StyledDiv>
        {new Date((wrappedEvent as any).timestamp * 1000).toUTCString()} - {argsData}
      </StyledDiv>
    );
  }

  private renderUnsupportedEvent(event: any): JSX.Element {
    return <>{event.event}</>;
  }

  private renderChallengeEvent(args: CivilTCR.Args._Challenge): JSX.Element {
    return (
      <Link to={"/listing/" + this.props.listing + "/challenge/" + args.challengeID.toString()}>
        Challenge --- ID: {args.challengeID.toString()}
      </Link>
    );
  }

  private renderApplicationEvent(args: CivilTCR.Args._Application): JSX.Element {
    return <>Application --- Deposit: {args.deposit.toString()}</>;
  }
  private renderNewListingWhitelistedEvent(args: CivilTCR.Args._ApplicationWhitelisted): JSX.Element {
    return <>Whitelisted!</>;
  }
}

export default ListingEvent;

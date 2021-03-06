import * as React from "react";
import { Switch, Route, withRouter, RouteComponentProps } from "react-router-dom";
import Listings from "./listinglist/Listings";
import Contracts from "./Contracts";
import ContractPage from "./ContractPage";
import ChallengePage from "./listing/Challenge";
import Listing from "./listing/Listing";
import Editor from "./Editor";
import NewsroomManagement from "./newsroom/NewsroomManagementV2";
import NewsroomManagementV1 from "./newsroom/NewsroomManagement";
import Parameterizer from "./Parameterizer";
import ParameterizerProposal from "./parameterizer/Proposal";
import CreateNewsroom from "./CreateNewsroom";
import Article from "./Article";
import { getCivil } from "../helpers/civilInstance";
import { initializeSubscriptions, initializeChallengeSubscriptions } from "../helpers/listingEvents";
import { initializeParameterizer, initializeProposalsSubscriptions } from "../helpers/parameterizer";
import { initializeGovernment, initializeGovernmentParamSubscription } from "../helpers/government";
import { addUser } from "../actionCreators/userAccount";
import { connect, DispatchProp } from "react-redux";

class Main extends React.Component<DispatchProp<any> & RouteComponentProps<any>> {
  public async componentDidMount(): Promise<void> {
    const civil = getCivil();
    civil.addCallbackToSetAccountEmitter(this.onAccountUpdated);
    await this.onAccountUpdated();
    await initializeParameterizer(this.props.dispatch!);
    await initializeGovernment(this.props.dispatch!);
    await initializeProposalsSubscriptions(this.props.dispatch!);
    await initializeGovernmentParamSubscription(this.props.dispatch!);
    await initializeSubscriptions(this.props.dispatch!);
  }

  public onAccountUpdated = async (): Promise<void> => {
    const civil = getCivil();
    if (civil.userAccount) {
      const tcr = civil.tcrSingletonTrusted();
      const token = await tcr.getToken();
      const balance = await token.getBalance(civil.userAccount);
      this.props.dispatch!(addUser(civil.userAccount, balance));
      await initializeChallengeSubscriptions(this.props.dispatch!, civil.userAccount);
    }
  };

  public render(): JSX.Element {
    return (
      <Switch>
        <Route exact path="/" component={Listings} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/contract/:contract" component={ContractPage} />
        <Route path="/listing/:listing/challenge/:challengeID" component={ChallengePage} />
        <Route path="/listing/:listing" component={Listing} />
        <Route path="/editor" component={Editor} />
        <Route path="/mgmt/:newsroomAddress" component={NewsroomManagement} />
        <Route path="/mgmt-v1/:newsroomAddress" component={NewsroomManagementV1} />
        <Route path="/parameterizer/proposal/:propId" component={ParameterizerProposal} />
        <Route path="/parameterizer" component={Parameterizer} />
        <Route path="/createNewsroom" component={CreateNewsroom} />
        <Route path="/article/:newsroomAddress/:articleId" component={Article} />
      </Switch>
    );
  }
}

export default withRouter(connect()(Main));

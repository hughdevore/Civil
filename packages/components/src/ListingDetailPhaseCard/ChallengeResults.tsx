import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { getNumberStringWithCommaDelimeters } from "@joincivil/utils";
import { colors, fonts } from "../styleConstants";
import { buttonSizes, Button, DarkButton, InvertedButton } from "../Button";
import { InputGroup, TextInput } from "../input/";

export interface BreakdownBarPercentageProps {
  vote: string;
  percentage: number;
}
export interface VotesPerTokenVoteProps {
  vote?: string;
}

const VoteTypeSummary = styled.div`
  display: flex;

  & > div {
    box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, inset 0 -1px 0 0 ${colors.accent.CIVIL_GRAY_4};
    padding: 14px 0;
    width: 50%;
  }
`;

const BreakdownBarContainer = styled.div`
  display: flex;
`;

const BreakdownBarPercentageLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 17px;
  width: 50px;
`;

const BreakdownBarTotal = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  height: 8px;
  margin-top: 4px;
  position: relative;
  width: 100%;
`;
const BreakdownBarPercentage = styled<BreakdownBarPercentageProps, "div">("div")`
  display: inline-block;
  background-color: ${props => (props.vote === "remain" ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED)};
  height: 8px;
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
  width: ${props => props.percentage.toString()}%;
`;

const VotesPerTokenContainer = styled.div`
  display: flex;
`;
const VotesPerTokenVote = styled<VotesPerTokenVoteProps, "div">("div")`
  width: 95px;

  & > span {
    color: ${props => (props.vote === "remain" ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED)};
  ]
`;
const VotesPerTokenTotal = VotesPerTokenVote.extend`
  color: ${colors.accent.CIVIL_GRAY_3};
  text-transform: uppercase;
  width: 95px;
`;
const VotesPerTokenCount = styled.div``;

const FormHeader = styled.h4`
  font-size: 21px;
  line-height: 25px;
  margin: 0;
`;
const FormCopy = styled.p`
  font-size: 16px;
  line-height: 26px;
  margin: 0 0 10px;
`;

export class ChallengeResults extends React.Component {
  public render(): JSX.Element {
    const remain = 73000;
    const remove = 27000;
    const remainPct = Math.floor(remain / (remain + remove) * 100);
    const removePct = 100 - remainPct;
    return (
      <>
        <FormHeader>Challenge Results</FormHeader>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenVote vote="remain">
              <span>✔</span> Remain
            </VotesPerTokenVote>
            <VotesPerTokenCount>{getNumberStringWithCommaDelimeters(remain)}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <BreakdownBarPercentageLabel>{remainPct}%</BreakdownBarPercentageLabel>
            <BreakdownBarTotal>
              <BreakdownBarPercentage vote="remain" percentage={remainPct} />
            </BreakdownBarTotal>
          </BreakdownBarContainer>
        </VoteTypeSummary>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenVote vote="remove">
              <span>✖</span> Remove
            </VotesPerTokenVote>
            <VotesPerTokenCount>{getNumberStringWithCommaDelimeters(remove)}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <BreakdownBarPercentageLabel>{removePct}%</BreakdownBarPercentageLabel>
            <BreakdownBarTotal>
              <BreakdownBarPercentage vote="remove" percentage={removePct} />
            </BreakdownBarTotal>
          </BreakdownBarContainer>
        </VoteTypeSummary>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenTotal>Total Votes</VotesPerTokenTotal>
            <VotesPerTokenCount>{getNumberStringWithCommaDelimeters(remain + remove)}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <a href="#">Read more details</a>
          </BreakdownBarContainer>
        </VoteTypeSummary>
      </>
    );
  }

  private onChange = (): void => {
    return;
  };
}
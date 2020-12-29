import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import parse from 'html-react-parser';
import * as SC from './style';

export const GoalsPanel = ({ goalsFromMavat }) => {
	const theme = useTheme();
	if (!goalsFromMavat) return null;
	
	return (
		<TabPanel>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planGoals}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.EntryContent>
					{parse(goalsFromMavat)}
				</SC.EntryContent>
			</TabBox>
		</TabPanel>
	);
};

GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
};

export default GoalsPanel;
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';
import { Button, Card, Text, Modal, Input, useTheme, Link } from '@nextui-org/react';
import { useState } from 'react';
import { useStore } from './store';
import moment from 'moment';

const Main = styled.div`
  margin: 0 1rem;
  margin-bottom: 2rem;
`;

const ProgressBarContainer = styled.div`
  max-width: 20rem;
  margin: 3rem auto;
`;

const CenterAligned = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HistoryContainer = styled.div`
  margin: 0 auto;
  max-width: 40rem;
  margin-top: 1rem;
`;

const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;


function App() {
  const [visible, setVisible] = useState(false);
  const [goalModalvisible, setGoalModalVisible] = useState(false);
  const { theme } = useTheme()
  const entries = useStore(state => state.entries);
  const total = useStore(state => state.getTotal());
  const goal = useStore(state => state.goal);
  const addEntry = useStore(state => state.addEntry);
  const setGoal = useStore(state => state.setGoal);
  const completionPercent = useStore(state => state.getCompletionPercent());


  function handleForm(e) {
    e.preventDefault();
    const amount = e.target.amount.value;
    setVisible(false);
    addEntry({ amount: amount, date: moment().valueOf() });
  }

  function handleGoalForm(e) {
    e.preventDefault();
    const goal = e.target.goal.value;
    setGoalModalVisible(false);
    setGoal(goal);
  }

  return (
    <Main>
      <ProgressBarContainer>
        <CircularProgressbarWithChildren
          value={completionPercent}
          styles={{
            path: { stroke: theme.colors.primary.value },
            trail: { stroke: theme.colors.gray200.value }
          }}
        >
          <CenterAligned>
            <Text size="3rem" weight="semibold">{total}</Text>
            <Text>of <Link block onClick={() => setGoalModalVisible(true)}>${goal}</Link></Text>
          </CenterAligned>
        </CircularProgressbarWithChildren>
      </ProgressBarContainer>

      <HistoryContainer>
        <SpaceBetween>
          <Text size="2rem" weight="semibold">History</Text>
          <Button
            flat
            auto
            onClick={() => setVisible(true)}
          >New</Button>
        </SpaceBetween>
        <EntryContainer>
          {entries.map(entry => (
            <Card bordered={true} shadow={false} key={entry.date}>
              <SpaceBetween>
                <Text weight="semibold">{entry.amount}</Text>
                <Text>{moment(entry.date).calendar()}</Text>
              </SpaceBetween>
            </Card>
          ))}
          {entries.length === 0 && (
            <Card>
              <Text>You don't have any entries yet. Click <Text as="span" color="primary">New</Text> above to start.</Text>
            </Card>
          )}
        </EntryContainer>
      </HistoryContainer>
      <Modal
        closeButton
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text>Add deposit or withdrawal</Text>
        </Modal.Header>
        <form
          onSubmit={handleForm}
        >
          <Modal.Body>
            <Input
              bordered
              label="Amount"
              autoFocus
              name="amount"
              type="number"
            />
            <Button auto>Add</Button>
          </Modal.Body>
        </form>
      </Modal>
      <Modal
        closeButton
        open={goalModalvisible}
        onClose={() => setGoalModalVisible(false)}
      >
        <Modal.Header>
          <Text>Set goal</Text>
        </Modal.Header>
        <form
          onSubmit={handleGoalForm}
        >
          <Modal.Body>
            <Input
              bordered
              label="Goal"
              autoFocus
              name="goal"
              type="number"
            />
            <Button auto>Set</Button>
          </Modal.Body>
        </form>
      </Modal>
    </Main>
  );
}

export default App;

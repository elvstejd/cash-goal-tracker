import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';
import { Button, Card, Text, Modal, Input, useTheme } from '@nextui-org/react';
import { useState } from 'react';
import { useStore } from './store';

const Main = styled.div`
  margin: 0 1rem;
  margin-bottom: 2rem;
`;

const ProgressBarContainer = styled.div`
  width: 20rem;
  margin: 0 auto;
  margin-top: 2rem;
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
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;


function App() {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme()
  const entries = useStore(state => state.entries);
  const total = useStore(state => state.getTotal());
  const goal = useStore(state => state.goal);
  const addEntry = useStore(state => state.addEntry);
  const completionPercent = useStore(state => state.getCompletionPercent());

  function handleForm(e) {
    e.preventDefault();
    const amount = e.target.amount.value;
    setVisible(false);
    addEntry({ amount: amount, date: 'today' });
    console.log(amount);
  }

  return (
    <Main>
      <ProgressBarContainer>
        <CircularProgressbarWithChildren
          value={completionPercent}
          styles={{
            path: { stroke: theme.colors.primary.value }
          }}
        >
          <CenterAligned>
            <pre>
              {completionPercent}
            </pre>
            <Text size="3rem" weight="semibold">{total}</Text>
            <Text>of ${goal}</Text>
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
            <Card bordered={true} shadow={false}>
              <SpaceBetween>
                <Text>{entry.amount}</Text>
                <Text>{entry.date}</Text>
              </SpaceBetween>
            </Card>
          ))}
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
    </Main>
  );
}

export default App;

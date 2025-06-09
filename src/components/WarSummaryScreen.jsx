import { useState, useEffect } from 'react';
import { Card, Typography, Space, Row, Col, Avatar, Progress } from 'antd';
import { ArrowLeftOutlined, FastForwardOutlined, TeamOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/gameSlice';
import { useGameState, usePersonas, useStorySummary, usePersonasByFaction, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Paragraph, Text } = Typography;

const WarSummaryScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();
  const personas = usePersonas();
  const storySummary = useStorySummary();
  const team1Personas = usePersonasByFaction(gameState.story.team1Name);
  const team2Personas = usePersonasByFaction(gameState.story.team2Name);
  
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Get the story to display - prioritize API data
  const getWarStoryToDisplay = () => {
    // First check for API game data story/baseStory
    if (gameState.apiGameData?.baseStory && gameState.apiGameData.baseStory.trim()) {
      return gameState.apiGameData.baseStory;
    }
    
    if (gameState.apiGameData?.story && gameState.apiGameData.story.trim()) {
      return gameState.apiGameData.story;
    }
    
    // Then check storySummary from API
    if (storySummary && storySummary.trim()) {
      return storySummary;
    }
    
    // Finally fall back to user's story
    if (gameState.story.background && gameState.story.background.trim()) {
      return gameState.story.background;
    }
    
    // Create a default war story if nothing is available
    return `🌍 THE GREAT CONFLICT BEGINS 🌍

In a world torn by conflict, two mighty forces prepare for the ultimate battle that will determine the fate of all.

⚔️ THE OPPOSING FORCES ⚔️

${gameState.story.team1Name || 'Team Alpha'} stands ready with ${gameState.story.team1Size || '4'} brave warriors, each trained in the arts of war and strategy. Their commanders have spent years preparing for this moment, knowing that victory depends not just on numbers, but on the courage and skill of every soldier.

🛡️ Against them rises ${gameState.story.team2Name || 'Team Beta'} with ${gameState.story.team2Size || '4'} fierce fighters, united by their cause and driven by an unbreakable will to triumph. Their generals have forged them into an unstoppable force, ready to face any challenge.

👥 THE CHAMPIONS 👥

Elite warriors from both sides step forward as champions, each bringing unique skills and unwavering determination to the battlefield. These legendary figures will lead their forces through the chaos of war.

🔥 THE STAGE IS SET 🔥

The battlefield awaits. Ancient prophecies speak of this moment when heroes will rise and legends will be born. The outcome of this war will echo through history, remembered for generations to come.

The time for preparation has ended. The time for glory has begun.

⚡ LET THE WAR COMMENCE! ⚡`;
  };

  // Get team names from API data or fallback to defaults
  const getTeamNames = () => {
    let team1Name = 'Team Alpha';
    let team2Name = 'Team Beta';
    
    // Check if we have API data with team structure
    if (gameState.apiGameData?.team_one?.name) {
      team1Name = gameState.apiGameData.team_one.name;
    } else if (gameState.story.team1Name) {
      team1Name = gameState.story.team1Name;
    }
    
    if (gameState.apiGameData?.team_two?.name) {
      team2Name = gameState.apiGameData.team_two.name;
    } else if (gameState.story.team2Name) {
      team2Name = gameState.story.team2Name;
    }
    
    return { team1Name, team2Name };
  };

  const { team1Name, team2Name } = getTeamNames();
  const warStory = getWarStoryToDisplay();

  useEffect(() => {
    let index = 0;
    const typingSpeed = 30; // milliseconds per character

    const typeWriter = () => {
      if (index < warStory.length) {
        setDisplayedText(warStory.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        setIsTypingComplete(true);
      }
    };

    // Start typing after a short delay
    const startDelay = setTimeout(typeWriter, 500);

    return () => clearTimeout(startDelay);
  }, [warStory]);

  const skipTyping = () => {
    setDisplayedText(warStory);
    setIsTypingComplete(true);
  };

  const goBack = () => {
    dispatch(setCurrentScreen('map-editor'));
  };

  const viewCharacters = () => {
    dispatch(setCurrentScreen('view-characters'));
  };

  const getStatColor = (value) => {
    if (value <= 33) return '#ff4757';
    if (value <= 66) return '#ffa502';
    return '#2ed573';
  };

  return (
    <div className="screen war-summary-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">📜 WAR CHRONICLES</Title>
        <Paragraph className="subtitle">The legend begins...</Paragraph>
        
        {/* Show API data source indicator */}
        {gameState.apiGameData && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            background: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            borderRadius: '8px',
            padding: '1rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <Text style={{ color: '#2ed573', fontSize: '1rem', fontWeight: 'bold' }}>
              🤖 API GENERATED STORY
            </Text>
            <br />
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              {gameState.apiGameData.baseStory ? 'Base Story' : gameState.apiGameData.story ? 'Story' : 'Generated Content'} • 
              Game ID: {gameState.gameId || 'Unknown'}
            </Text>
          </div>
        )}
        
        <Card 
          className="war-story-container"
          style={{
            backgroundColor: 'rgba(46, 213, 115, 0.05)',
            border: '2px solid #2ed573',
            borderRadius: '15px',
            margin: '2rem auto',
            maxWidth: '900px',
            minHeight: '400px',
            position: 'relative'
          }}
          bordered={false}
        >
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#ffffff', whiteSpace: 'pre-line' }}>
            {displayedText.split('\n').map((line, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: line.trim() === '' ? '1rem' : '0.5rem',
                  animation: 'fadeInLine 0.3s ease'
                }}
              >
                {line}
              </div>
            ))}
            {!isTypingComplete && (
              <Text style={{ color: '#ff6b35', fontWeight: 'bold', animation: 'blink 1s infinite' }}>
                |
              </Text>
            )}
          </div>
          
          {!isTypingComplete && (
            <Button 
              style={{ position: 'fixed', bottom: '30px', right: '30px' }}
              onClick={skipTyping}
              variant="secondary"
              icon={<FastForwardOutlined />}
            >
              SKIP
            </Button>
          )}
        </Card>

        {/* Show personas/characters if available and typing is complete */}
        {isTypingComplete && personas.length > 0 && (
          <Card 
            style={{
              backgroundColor: 'rgba(46, 213, 115, 0.05)',
              border: '2px solid #2ed573',
              borderRadius: '15px',
              margin: '2rem auto',
              maxWidth: '1200px'
            }}
            bordered={false}
          >
            <Title level={3} style={{ textAlign: 'center', color: '#2ed573', marginBottom: '2rem' }}>
              🏆 LEGENDARY WARRIORS
            </Title>
            
            <Row gutter={[32, 24]}>
              {/* Team 1 */}
              <Col xs={24} lg={12}>
                <Card 
                  size="small"
                  title={
                    <Text strong style={{ color: '#2ed573', fontSize: '1.2rem' }}>
                      ⚔️ {team1Name}
                    </Text>
                  }
                  style={{ 
                    backgroundColor: 'rgba(46, 213, 115, 0.1)',
                    border: '1px solid #2ed573'
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {team1Personas.slice(0, 4).map((persona, index) => (
                      <Card 
                        key={persona.name}
                        size="small"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(46, 213, 115, 0.3)'
                        }}
                      >
                        <Row align="middle" gutter={[12, 0]}>
                          <Col>
                            <Avatar style={{ backgroundColor: '#2ed573', color: '#000' }}>
                              {persona.name.charAt(0)}
                            </Avatar>
                          </Col>
                          <Col flex={1}>
                            <Text strong style={{ color: '#ffffff', display: 'block' }}>
                              {persona.name}
                            </Text>
                            <Text style={{ color: '#2ed573', fontSize: '0.9rem' }}>
                              {persona.type} • {persona.npcType}
                            </Text>
                          </Col>
                          <Col>
                            <div style={{ textAlign: 'right' }}>
                              <Text style={{ color: getStatColor(persona.morale), fontSize: '0.8rem' }}>
                                Morale: {persona.morale}
                              </Text>
                              <br />
                              <Text style={{ color: getStatColor(persona.health), fontSize: '0.8rem' }}>
                                Health: {persona.health}
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    {team1Personas.length > 4 && (
                      <Text style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', display: 'block' }}>
                        +{team1Personas.length - 4} more warriors...
                      </Text>
                    )}
                  </Space>
                </Card>
              </Col>

              {/* Team 2 */}
              <Col xs={24} lg={12}>
                <Card 
                  size="small"
                  title={
                    <Text strong style={{ color: '#ff6b35', fontSize: '1.2rem' }}>
                      🛡️ {team2Name}
                    </Text>
                  }
                  style={{ 
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid #ff6b35'
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {team2Personas.slice(0, 4).map((persona, index) => (
                      <Card 
                        key={persona.name}
                        size="small"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 107, 53, 0.3)'
                        }}
                      >
                        <Row align="middle" gutter={[12, 0]}>
                          <Col>
                            <Avatar style={{ backgroundColor: '#ff6b35', color: '#fff' }}>
                              {persona.name.charAt(0)}
                            </Avatar>
                          </Col>
                          <Col flex={1}>
                            <Text strong style={{ color: '#ffffff', display: 'block' }}>
                              {persona.name}
                            </Text>
                            <Text style={{ color: '#ff6b35', fontSize: '0.9rem' }}>
                              {persona.type} • {persona.npcType}
                            </Text>
                          </Col>
                          <Col>
                            <div style={{ textAlign: 'right' }}>
                              <Text style={{ color: getStatColor(persona.morale), fontSize: '0.8rem' }}>
                                Morale: {persona.morale}
                              </Text>
                              <br />
                              <Text style={{ color: getStatColor(persona.health), fontSize: '0.8rem' }}>
                                Health: {persona.health}
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    {team2Personas.length > 4 && (
                      <Text style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', display: 'block' }}>
                        +{team2Personas.length - 4} more warriors...
                      </Text>
                    )}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        )}
        
        {isTypingComplete && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button 
              onClick={viewCharacters}
              variant="primary"
              icon={<TeamOutlined />}
              size="large"
            >
              VIEW ALL CHARACTERS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarSummaryScreen;
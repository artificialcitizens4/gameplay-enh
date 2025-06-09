import { Typography, Card, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { setCurrentScreen, updateStory } from '../store/slices/gameSlice';
import { useGameState, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Paragraph, Text } = Typography;

const TeamSetupScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();

  const proceedToBuildTeams = () => {
    dispatch(setCurrentScreen('build-teams'));
  };

  const goBack = () => {
    // In experience mode, go back to experience selection
    // In create mode, go back to story screen
    if (gameState.gameMode === 'experience') {
      dispatch(setCurrentScreen('select-experience'));
    } else {
      dispatch(setCurrentScreen('story'));
    }
  };

  // Get the story to display - prioritize API data over user input
  const getStoryToDisplay = () => {
    // First check for API game data story/baseStory
    if (gameState.apiGameData?.baseStory && gameState.apiGameData.baseStory.trim()) {
      return gameState.apiGameData.baseStory;
    }
    
    if (gameState.apiGameData?.story && gameState.apiGameData.story.trim()) {
      return gameState.apiGameData.story;
    }
    
    // Then check storySummary from API
    if (gameState.storySummary && gameState.storySummary.trim()) {
      return gameState.storySummary;
    }
    
    // Finally fall back to user's story
    if (gameState.story.background && gameState.story.background.trim()) {
      return gameState.story.background;
    }
    
    // Final fallback
    return 'No background story provided yet...';
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

  // Get team sizes from API data or fallback to defaults
  const getTeamSizes = () => {
    let team1Size = 4;
    let team2Size = 4;
    
    // Check if we have API data with team structure
    if (gameState.apiGameData?.team_one?.persona?.length) {
      team1Size = gameState.apiGameData.team_one.persona.length;
    } else if (gameState.story.teamSizeA || gameState.story.team1Size) {
      team1Size = gameState.story.teamSizeA || gameState.story.team1Size;
    }
    
    if (gameState.apiGameData?.team_two?.persona?.length) {
      team2Size = gameState.apiGameData.team_two.persona.length;
    } else if (gameState.story.teamSizeB || gameState.story.team2Size) {
      team2Size = gameState.story.teamSizeB || gameState.story.team2Size;
    }
    
    return { team1Size, team2Size };
  };

  const { team1Name, team2Name } = getTeamNames();
  const { team1Size, team2Size } = getTeamSizes();
  const storyToDisplay = getStoryToDisplay();

  return (
    <div className="screen team-setup-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">⚔️ SETUP YOUR ARMIES</Title>
        <Paragraph className="subtitle">Review your opposing forces</Paragraph>
        
        {/* Show game mode indicator */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-block',
            background: gameState.gameMode === 'experience' 
              ? 'rgba(255, 107, 53, 0.1)' 
              : 'rgba(46, 213, 115, 0.1)',
            border: `1px solid ${gameState.gameMode === 'experience' ? '#ff6b35' : '#2ed573'}`,
            borderRadius: '8px',
            padding: '0.5rem 1rem'
          }}>
            <Text style={{ 
              color: gameState.gameMode === 'experience' ? '#ff6b35' : '#2ed573',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {gameState.gameMode === 'experience' ? '🎮 EXPERIENCE MODE' : '🛠️ CREATE MODE'}
            </Text>
          </div>
        </div>
        
        <Row gutter={[32, 32]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={8}>
            <Card 
              className="story-summary" 
              title={<Text strong style={{ color: '#ff6b35', fontSize: '1.5rem' }}>📜 War Background</Text>}
              bordered={false}
              style={{ height: '100%' }}
            >
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                {storyToDisplay}
              </Paragraph>
              
              {/* Show game ID if available */}
              {gameState.gameId && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                    Game ID: {gameState.gameId}
                  </Text>
                </div>
              )}

              {/* Show experience mode info */}
              {gameState.gameMode === 'experience' && gameState.selectedExperience && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  border: '1px solid #ff6b35',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#ff6b35', fontSize: '0.8rem' }}>
                    Experience: {gameState.selectedExperience}
                  </Text>
                </div>
              )}

              {/* Show persona count if available */}
              {gameState.personas && gameState.personas.length > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                    👥 {gameState.personas.length} warriors loaded from API
                  </Text>
                </div>
              )}

              {/* Show API data source indicator */}
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem' }}>
                  {gameState.apiGameData?.baseStory || gameState.apiGameData?.story
                    ? '🤖 API Generated Story'
                    : gameState.storySummary && gameState.storySummary.trim()
                    ? '🤖 Generated Story Summary'
                    : gameState.story.background && gameState.story.background.trim()
                    ? '📝 User Story'
                    : '⚠️ No Story'
                  }
                </Text>
              </div>

              {/* Show team structure from API if available */}
              {gameState.apiGameData && (gameState.apiGameData.team_one || gameState.apiGameData.team_two) && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(46, 213, 115, 0.05)',
                  border: '1px solid rgba(46, 213, 115, 0.2)',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#2ed573', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>
                    🏛️ API Team Structure:
                  </Text>
                  {gameState.apiGameData.team_one && (
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block' }}>
                      Team 1: {gameState.apiGameData.team_one.name} ({gameState.apiGameData.team_one.persona?.length || 0} warriors)
                    </Text>
                  )}
                  {gameState.apiGameData.team_two && (
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block' }}>
                      Team 2: {gameState.apiGameData.team_two.name} ({gameState.apiGameData.team_two.persona?.length || 0} warriors)
                    </Text>
                  )}
                </div>
              )}
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={11}>
                <Card className="team-config-box" bordered={false}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#2ed573', textAlign: 'center', margin: 0 }}>
                      ⚔️ TEAM ONE
                    </Title>
                    
                    <div className="team-info">
                      <Title level={4} style={{ color: '#2ed573', textAlign: 'center', margin: '0 0 1rem 0' }}>
                        {team1Name}
                      </Title>
                      <Paragraph style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Elite warriors ready for battle
                      </Paragraph>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem' }}>
                        Army Size
                      </Text>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(46, 213, 115, 0.1)',
                        border: '2px solid #2ed573',
                        borderRadius: '12px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#2ed573',
                        margin: '0 auto',
                        boxShadow: '0 0 20px rgba(46, 213, 115, 0.3)'
                      }}>
                        {team1Size}
                      </div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                        Warriors
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={2} style={{ color: '#ff4757', margin: 0, textAlign: 'center' }}>
                  VS
                </Title>
              </Col>
              
              <Col xs={24} md={11}>
                <Card className="team-config-box" bordered={false} style={{ borderColor: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.05)' }}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#ff6b35', textAlign: 'center', margin: 0 }}>
                      🛡️ TEAM TWO
                    </Title>
                    
                    <div className="team-info">
                      <Title level={4} style={{ color: '#ff6b35', textAlign: 'center', margin: '0 0 1rem 0' }}>
                        {team2Name}
                      </Title>
                      <Paragraph style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Fierce fighters prepared for war
                      </Paragraph>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem' }}>
                        Army Size
                      </Text>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        border: '2px solid #ff6b35',
                        borderRadius: '12px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#ff6b35',
                        margin: '0 auto',
                        boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
                      }}>
                        {team2Size}
                      </div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                        Warriors
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Battle Preview Summary */}
            <Card 
              style={{ 
                marginTop: '2rem',
                backgroundColor: 'rgba(46, 213, 115, 0.05)',
                border: '2px solid #2ed573',
                borderRadius: '15px'
              }}
              bordered={false}
            >
              <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#2ed573', margin: 0 }}>
                  ⚔️ BATTLE PREVIEW
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
                  {team1Name} ({team1Size} warriors) 
                  <span style={{ color: '#ff4757', fontWeight: 'bold', margin: '0 1rem' }}>VS</span>
                  {team2Name} ({team2Size} warriors)
                </Text>
                
                {/* Show army size difference if any */}
                {team1Size !== team2Size && (
                  <Text style={{ color: '#ffa502', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    ⚖️ Uneven forces detected - strategic advantage to larger army
                  </Text>
                )}
                
                {team1Size === team2Size && (
                  <Text style={{ color: '#2ed573', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    ⚖️ Balanced forces - victory depends on strategy and skill
                  </Text>
                )}

                {/* Show mode-specific info */}
                {gameState.gameMode === 'experience' && (
                  <Text style={{ color: '#ff6b35', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    🎮 Pre-configured experience with unique warriors and backstories
                  </Text>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button 
            onClick={proceedToBuildTeams}
            icon={<ArrowRightOutlined />}
            size="large"
          >
            {gameState.gameMode === 'experience' ? 'CUSTOMIZE WARRIORS' : 'BUILD YOUR CHAMPIONS'}
          </Button>
          
          <div style={{ marginTop: '1rem' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              {gameState.gameMode === 'experience' 
                ? '💡 Experience mode: Warriors are pre-loaded, you can customize their combat stats'
                : '💡 Team sizes are locked from your story configuration'
              }
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupScreen;
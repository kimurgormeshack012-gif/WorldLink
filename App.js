
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const BLUE = '#287BFF';
const PURPLE = '#8B4DFF';
const NAVY = '#090E2D';
const CARD = '#171E49';
const WHITE = '#FFFFFF';
const MUTED = '#B9C4E9';

function Action({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, secondary && styles.secondary]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Field({ value, onChangeText, placeholder, secureTextEntry = false }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8992B8"
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      style={styles.input}
    />
  );
}

function Avatar({ name, size = 48 }) {
  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size / 2 }
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>
        {(name || 'W').charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('Welcome');
  const [tab, setTab] = useState('Home');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Amina Kenya 🇰🇪',
      text: 'Greetings from Nairobi! Connect • Share • Belong. 🌍',
      likes: 12
    }
  ]);

  const [following, setFollowing] = useState([]);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [liked, setLiked] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const goTab = (next) => {
    setTab(next);
    setScreen('App');
  };

  const addPost = () => {
    if (!caption.trim()) {
      Alert.alert('Empty post', 'Write something before sharing.');
      return;
    }

    const newPost = {
      id: Date.now(),
      author: name.trim() || 'WorldLink Member',
      text: caption.trim(),
      likes: 0
    };

    setPosts(old => [newPost, ...old]);
    setCaption('');
    setTab('Home');
  };

  const follow = (person) => {
    setFollowing(old =>
      old.includes(person)
        ? old.filter(x => x !== person)
        : [...old, person]
    );
  };

  const toggleLike = (id) => {
    setLiked(old =>
      old.includes(id)
        ? old.filter(x => x !== id)
        : [...old, id]
    );
  };

  const reportPost = (post) => {
    Alert.alert('Report post', 'Choose a reason:', [
      { text: 'Bullying or harassment', onPress: () => saveReport(post, 'Bullying or harassment') },
      { text: 'Spam or scam', onPress: () => saveReport(post, 'Spam or scam') },
      { text: 'Inappropriate content', onPress: () => saveReport(post, 'Inappropriate content') },
      { text: 'Other concern', onPress: () => saveReport(post, 'Other concern') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const saveReport = (post, reason) => {
    setReports(old => [
      ...old,
      { id: Date.now(), postId: post.id, author: post.author, reason }
    ]);

    Alert.alert(
      'Report saved',
      'This is a local demo report. It has not been sent to a moderator.'
    );
  };

  const blockUser = (person) => {
    Alert.alert('Block account?', `Hide ${person}'s demo posts?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: () => {
          setBlockedUsers(old =>
            old.includes(person) ? old : [...old, person]
          );
          setFollowing(old => old.filter(x => x !== person));
        }
      }
    ]);
  };

  const unblockUser = (person) => {
    setBlockedUsers(old => old.filter(x => x !== person));
  };

  const register = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please complete all fields.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }

    setScreen('App');
    setTab('Home');
  };

  const login = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Enter your email and password.');
      return;
    }

    Alert.alert(
      'Demo login',
      'This version does not yet connect to a real account system.',
      [{ text: 'Continue', onPress: () => {
        setScreen('App');
        setTab('Home');
      }}]
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Text style={styles.brandIcon}>🌍</Text>
        <Text style={styles.logo}>
          World<Text style={styles.logoPurple}>Link</Text>
        </Text>
      </View>
      <Text style={styles.tagline}>CONNECT • SHARE • BELONG</Text>
    </View>
  );

  const Nav = () => {
    const items = [
      { name: 'Home', icon: '⌂' },
      { name: 'Discover', icon: '◎' },
      { name: 'Create', icon: '＋' },
      { name: 'Messages', icon: '✉' },
      { name: 'Profile', icon: '◉' }
    ];

    return (
      <View style={styles.nav}>
        {items.map(item => (
          <TouchableOpacity
            key={item.name}
            onPress={() => goTab(item.name)}
            style={[
              styles.navItem,
              tab === item.name && styles.navActive
            ]}
          >
            <Text style={[
              styles.navIcon,
              tab === item.name && styles.navSelected
            ]}>
              {item.icon}
            </Text>
            <Text style={[
              styles.navText,
              tab === item.name && styles.navSelected
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const PostCard = ({ post }) => {
    const isLiked = liked.includes(post.id);
    const likes = post.likes + (isLiked ? 1 : 0);

    return (
      <View style={styles.card}>
        <View style={styles.postHeader}>
          <Avatar name={post.author} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{post.author}</Text>
            <Text style={styles.small}>WorldLink community</Text>
          </View>
          <Text style={styles.moreIcon}>•••</Text>
        </View>

        <Text style={styles.postText}>{post.text}</Text>

        <View style={styles.postDivider} />

        <View style={styles.postActions}>
          <TouchableOpacity onPress={() => toggleLike(post.id)}>
            <Text style={[styles.link, isLiked && { color: '#FF77A8' }]}>
              {isLiked ? '♥' : '♡'} {likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Comments', 'Comments will be added in a future version.')}
          >
            <Text style={styles.link}>▢ Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Share', 'Post sharing will be connected in a future version.')}
          >
            <Text style={styles.link}>↗ Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.safetyRow}>
          <TouchableOpacity onPress={() => reportPost(post)}>
            <Text style={styles.safetyLink}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => blockUser(post.author)}>
            <Text style={styles.safetyLink}>Block author</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <Header />

      {screen === 'Welcome' && (
        <View style={styles.center}>
          <View style={styles.heroCircle}>
            <Text style={styles.globe}>🌐</Text>
          </View>

          <Text style={styles.title}>Your World.</Text>
          <Text style={styles.heroPurple}>Your Community.</Text>

          <Text style={styles.muted}>
            Meet people, share your experiences and build connections
            across the world.
          </Text>

          <Action
            title="Create account  →"
            onPress={() => setScreen('Register')}
          />

          <Action
            title="Log in"
            secondary
            onPress={() => setScreen('Login')}
          />

          <Text style={styles.note}>
            A community without borders. 🌍
          </Text>
        </View>
      )}

      {screen === 'Register' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Join WorldLink</Text>
            <Text style={styles.muted}>
              Create your profile and meet your global community.
            </Text>

            <Field value={name} onChangeText={setName} placeholder="Full name or username" />
            <Field value={email} onChangeText={setEmail} placeholder="Email address" />
            <Field value={password} onChangeText={setPassword} placeholder="Password (6+ characters)" secureTextEntry />

            <Action title="Create account →" onPress={register} />
            <Action title="Back" secondary onPress={() => setScreen('Welcome')} />

            <Text style={styles.note}>
              Demo only: account registration is not connected to a server.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {screen === 'Login' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.muted}>Log in to your WorldLink demo.</Text>

          <Field value={email} onChangeText={setEmail} placeholder="Email address" />
          <Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

          <Action title="Log in →" onPress={login} />
          <Action title="Back" secondary onPress={() => setScreen('Welcome')} />

          <Text style={styles.note}>
            Demo only: real authentication is not connected.
          </Text>
        </ScrollView>
      )}

      {screen === 'App' && (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {tab === 'Home' && (
              <>
                <Text style={styles.title}>Your Feed</Text>
                <Text style={styles.muted}>
                  Discover what's happening around your world.
                </Text>

                <View style={styles.sectionHeading}>
                  <Text style={styles.section}>Community stories</Text>
                  <Text style={styles.small}>Explore</Text>
                </View>

                <View style={styles.storyRow}>
                  {['Your story', 'Sarah 🇰🇪', 'David 🇺🇬', 'Maria 🇧🇷'].map((x, i) => (
                    <View style={styles.story} key={x}>
                      <Text style={styles.storyEmoji}>
                        {i === 0 ? '＋' : '✨'}
                      </Text>
                      <Text style={styles.small}>{x}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.section}>Recent posts</Text>

                {posts
                  .filter(p => !blockedUsers.includes(p.author))
                  .map(p => <PostCard key={p.id} post={p} />)}

                {posts.length === 0 && (
                  <Text style={styles.muted}>No posts yet. Start sharing!</Text>
                )}
              </>
            )}

            {tab === 'Discover' && (
              <>
                <Text style={styles.title}>Discover</Text>
                <Text style={styles.muted}>
                  Find new people and communities.
                </Text>

                {[
                  'Sarah Wanjiku 🇰🇪',
                  'James Mwangi 🇰🇪',
                  'Maria Lopez 🇧🇷',
                  'David Ochieng 🇺🇬'
                ].filter(p => !blockedUsers.includes(p)).map(p => (
                  <View style={styles.person} key={p}>
                    <Avatar name={p} size={42} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{p}</Text>
                      <Text style={styles.small}>WorldLink member</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => follow(p)}
                      style={styles.followButton}
                    >
                      <Text style={styles.followText}>
                        {following.includes(p) ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => blockUser(p)}>
                      <Text style={styles.safetyLink}>Block</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <Text style={styles.section}>Explore communities</Text>
                <View style={styles.card}>
                  <Text style={styles.postText}>
                    🌍 Travel     💻 Technology
                  </Text>
                  <Text style={styles.postText}>
                    🎵 Music       📚 Learning
                  </Text>
                  <Text style={styles.postText}>
                    ⚽ Sports       🎨 Creativity
                  </Text>
                </View>
              </>
            )}

            {tab === 'Create' && (
              <>
                <Text style={styles.title}>Create a post</Text>
                <Text style={styles.muted}>
                  Share something with your community.
                </Text>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    What's happening in your world?
                  </Text>
                  <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="Write your thoughts..."
                    placeholderTextColor="#8992B8"
                    multiline
                    maxLength={500}
                    style={[styles.input, styles.multiline]}
                  />
                  <Text style={styles.small}>
                    {caption.length}/500 characters
                  </Text>
                </View>

                <Action title="Share post →" onPress={addPost} />
                <Text style={styles.note}>
                  Posts are stored locally in this demo.
                </Text>
              </>
            )}

            {tab === 'Messages' && (
              <>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.muted}>
                  Your conversations and connections.
                </Text>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>✉ Message requests</Text>
                  <Text style={styles.muted}>
                    Your message centre is currently a demo.
                  </Text>
                </View>

                {['James Mwangi', 'Sarah Wanjiku', 'David Ochieng']
                  .filter(p => !blockedUsers.includes(p))
                  .map(p => (
                    <View style={styles.person} key={p}>
                      <Avatar name={p} size={42} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.cardTitle}>{p}</Text>
                        <Text style={styles.small}>Demo conversation</Text>
                      </View>
                      <Text style={styles.link}>›</Text>
                    </View>
                  ))}
              </>
            )}

            {tab === 'Profile' && (
              <>
                <View style={styles.profileHeader}>
                  <Avatar name={name || 'WorldLink Member'} size={78} />
                  <Text style={styles.title}>
                    {name || 'WorldLink Member'}
                  </Text>
                  <Text style={styles.muted}>
                    Connect • Share • Belong 🌍
                  </Text>
                  <Text style={styles.small}>{email}</Text>
                </View>

                <View style={styles.stats}>
                  <View style={styles.statBox}>
                    <Text style={styles.stat}>
                      {posts.filter(p => p.author === (name || 'WorldLink Member')).length}
                    </Text>
                    <Text style={styles.small}>Posts</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.stat}>{following.length}</Text>
                    <Text style={styles.small}>Following</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.stat}>0</Text>
                    <Text style={styles.small}>Followers</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setPrivateAccount(!privateAccount)}
                  style={styles.card}
                >
                  <Text style={styles.cardTitle}>
                    🔒 Account privacy
                  </Text>
                  <Text style={styles.link}>
                    {privateAccount ? 'Private account' : 'Public account'} · Tap to change
                  </Text>
                </TouchableOpacity>

                <Text style={styles.section}>
                  Blocked accounts ({blockedUsers.length})
                </Text>

                {blockedUsers.length === 0
                  ? <Text style={styles.small}>No blocked accounts.</Text>
                  : blockedUsers.map(person => (
                    <View style={styles.person} key={person}>
                      <Text style={styles.cardTitle}>{person}</Text>
                      <TouchableOpacity onPress={() => unblockUser(person)}>
                        <Text style={styles.safetyLink}>Unblock</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                <Text style={styles.section}>
                  Reports made ({reports.length})
                </Text>
                <Text style={styles.small}>
                  Reports are saved locally in this demo, not sent to moderators.
                </Text>

                <Action
                  title="Log out"
                  secondary
                  onPress={() => {
                    setScreen('Welcome');
                    setTab('Home');
                  }}
                />
              </>
            )}
          </ScrollView>

          <Nav />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: NAVY
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#28315F'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandIcon: {
    fontSize: 27,
    marginRight: 8
  },
  logo: {
    fontSize: 27,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -1
  },
  logoPurple: {
    color: '#B58AFF'
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 2,
    color: MUTED,
    marginTop: 3
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  heroCircle: {
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor: '#18245D',
    borderWidth: 2,
    borderColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  globe: {
    fontSize: 72
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: WHITE,
    marginBottom: 12
  },
  heroPurple: {
    color: '#B58AFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12
  },
  muted: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14
  },
  button: {
    backgroundColor: BLUE,
    padding: 15,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 12,
    width: '100%'
  },
  secondary: {
    backgroundColor: '#292F60',
    borderWidth: 1,
    borderColor: '#555F9D'
  },
  buttonText: {
    color: WHITE,
    fontWeight: '800',
    fontSize: 15
  },
  input: {
    backgroundColor: '#171E49',
    borderWidth: 1,
    borderColor: '#354174',
    borderRadius: 12,
    padding: 14,
    color: WHITE,
    fontSize: 15,
    marginBottom: 12
  },
  note: {
    color: '#8F9BC5',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
    textAlign: 'center'
  },
  content: {
    padding: 18,
    paddingBottom: 30
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  storyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18
  },
  story: {
    alignItems: 'center',
    backgroundColor: '#1A2253',
    borderRadius: 14,
    padding: 10,
    minWidth: 70
  },
  storyEmoji: {
    fontSize: 24,
    color: '#B58AFF',
    marginBottom: 5
  },
  small: {
    fontSize: 11,
    color: MUTED
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2C376C'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: WHITE,
    marginBottom: 5
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    backgroundColor: '#49328C',
    borderWidth: 2,
    borderColor: '#9A75FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarText: {
    color: WHITE,
    fontWeight: '900'
  },
  moreIcon: {
    color: MUTED,
    fontWeight: '900',
    fontSize: 17
  },
  postText: {
    fontSize: 15,
    color: '#E4E9FF',
    lineHeight: 23,
    marginBottom: 14
  },
  postDivider: {
    height: 1,
    backgroundColor: '#303A70',
    marginBottom: 12
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  link: {
    color: '#B58AFF',
    fontWeight: '800',
    fontSize: 13
  },
  safetyRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 14
  },
  safetyLink: {
    color: '#C3A5FF',
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 5
  },
  person: {
    backgroundColor: CARD,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  followButton: {
    backgroundColor: BLUE,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    marginRight: 8
  },
  followText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '800'
  },
  section: {
    fontSize: 18,
    fontWeight: '800',
    color: WHITE,
    marginTop: 18,
    marginBottom: 10
  },
  multiline: {
    minHeight: 130,
    textAlignVertical: 'top'
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    borderRadius: 15,
    padding: 16,
    marginVertical: 18
  },
  statBox: {
    alignItems: 'center',
    flex: 1
  },
  stat: {
    color: WHITE,
    fontWeight: '900',
    fontSize: 21,
    marginBottom: 5
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: '#11183F',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#303A70'
  },
  navItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10
  },
  navActive: {
    backgroundColor: '#3A2A83'
  },
  navIcon: {
    color: '#AAB5E8',
    fontSize: 20,
    marginBottom: 3
  },
  navText: {
    color: '#AAB5E8',
    fontSize: 10,
    fontWeight: '700'
  },
  navSelected: {
    color: WHITE
  }
});

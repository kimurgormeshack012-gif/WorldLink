
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
  Platform,
} from 'react-native';

const C = {
  bg: '#080D20',
  surface: '#111A33',
  card: '#151F3D',
  border: '#263455',
  blue: '#287BFF',
  purple: '#8B4DFF',
  white: '#FFFFFF',
  muted: '#9BA8C7',
  green: '#27C995',
  red: '#FF637D',
};

const NAV_ITEMS = [
  { name: 'Home', icon: '⌂' },
  { name: 'Discover', icon: '◎' },
  { name: 'Create', icon: '+' },
  { name: 'Messages', icon: '✉' },
  { name: 'Profile', icon: '◉' },
];

function Button({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, secondary && styles.secondaryButton]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function Avatar({ name = 'WorldLink', size = 46 }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.34 }]}>
        {initials || 'W'}
      </Text>
    </View>
  );
}

function Badge({ label, color = C.blue }) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.linkText}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function App() {
  const [screen, setScreen] = useState('Login');
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('WorldLink Member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [search, setSearch] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: '1',
      name: 'Amina Kenya',
      text: 'Welcome to WorldLink! Connecting people and communities.',
      likes: 24,
      liked: false,
      time: '2 hours ago',
    },
    {
      id: '2',
      name: 'David Ochieng',
      text: 'Sharing ideas, meeting new people and building connections.',
      likes: 16,
      liked: false,
      time: '4 hours ago',
    },
  ]);
  const [following, setFollowing] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const goTab = value => {
    setTab(value);
    setScreen('App');
  };

  const register = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please complete all fields.');
      return;
    }
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Check your details', 'Enter a valid email and a password with at least 6 characters.');
      return;
    }
    Alert.alert('Demo account', 'Your local demo profile is ready.');
    setScreen('App');
    setTab('Home');
  };

  const login = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    setName(email.split('@')[0] || 'WorldLink Member');
    setScreen('App');
    setTab('Home');
  };

  const logout = () => {
    setScreen('Login');
    setPassword('');
  };

  const toggleLike = id => {
    setPosts(current =>
      current.map(post =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  };

  const addPost = () => {
    if (!caption.trim()) {
      Alert.alert('Empty post', 'Write something before publishing.');
      return;
    }

    setPosts(current => [
      {
        id: String(Date.now()),
        name,
        text: caption.trim(),
        likes: 0,
        liked: false,
        time: 'Just now',
      },
      ...current,
    ]);

    setCaption('');
    setTab('Home');
  };

  const toggleFollow = person => {
    setFollowing(current =>
      current.includes(person)
        ? current.filter(item => item !== person)
        : [...current, person]
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>W</Text>
        </View>
        <View>
          <Text style={styles.brand}>WorldLink</Text>
          <Text style={styles.tagline}>Connect beyond borders</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => goTab('Notifications')}
      >
        <Text style={styles.notificationIcon}>♢</Text>
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map(item => {
        const active = tab === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => goTab(item.name)}
          >
            <Text style={[styles.navIcon, active && styles.activeNavText]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, active && styles.activeNavText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const PostCard = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Avatar name={post.name} />
        <View style={styles.postIdentity}>
          <Text style={styles.personName}>{post.name}</Text>
          <Text style={styles.mutedText}>{post.time}</Text>
        </View>
        <Text style={styles.moreIcon}>•••</Text>
      </View>
      <Text style={styles.postText}>{post.text}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => toggleLike(post.id)}>
          <Text style={[styles.actionText, post.liked && { color: C.red }]}>
            {post.liked ? '♥' : '♡'}  {post.likes} Likes
          </Text>
        </TouchableOpacity>
        <Text style={styles.actionText}>◯  Comment</Text>
        <Text style={styles.actionText}>↗  Share</Text>
      </View>
    </View>
  );

  const HomeScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeSmall}>YOUR COMMUNITY</Text>
        <Text style={styles.welcomeTitle}>Welcome to WorldLink</Text>
        <Text style={styles.welcomeDescription}>
          Discover people, share your moments and build meaningful connections.
        </Text>
        <Button title="Explore community" onPress={() => goTab('Discover')} />
      </View>

      <View style={styles.buyDataCard}>
        <View style={styles.buyDataInfo}>
          <Text style={styles.buyDataIcon}>◈</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.buyDataTitle}>Buy Data</Text>
            <Text style={styles.buyDataDescription}>
              Data bundle services in one convenient place.
            </Text>
          </View>
        </View>
        <Button title="Explore data bundles →" onPress={() => goTab('Buy Data')} />
      </View>

      <SectionTitle title="Community stories" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['Your Story', 'Amina', 'David', 'Grace', 'Brian'].map((person, index) => (
          <TouchableOpacity
            key={person}
            style={styles.storyItem}
            onPress={() => Alert.alert(person, 'Stories will be available in a future update.')}
          >
            <View style={styles.storyRing}>
              <Avatar name={person} size={54} />
            </View>
            <Text style={styles.storyName}>{person}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionTitle
        title="Latest posts"
        action="Create post"
        onPress={() => goTab('Create')}
      />
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </ScrollView>
  );

  const DiscoverScreen = () => {
    const people = ['Amina Kenya', 'David Ochieng', 'Grace Wanjiku', 'Brian Otieno'];
    const filtered = people.filter(person =>
      person.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <ScrollView>
        <Text style={styles.pageTitle}>Discover</Text>
        <Text style={styles.pageSubtitle}>Find people and communities.</Text>
        <TextInput
          style={styles.input}
          placeholder="Search people..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {filtered.map(person => (
          <View style={styles.personCard} key={person}>
            <Avatar name={person} />
            <View style={styles.personIdentity}>
              <Text style={styles.personName}>{person}</Text>
              <Text style={styles.mutedText}>WorldLink community member</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.followButton,
                following.includes(person) && styles.followingButton,
              ]}
              onPress={() => toggleFollow(person)}
            >
              <Text style={styles.followButtonText}>
                {following.includes(person) ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No matching people found.</Text>
        )}
      </ScrollView>
    );
  };

  const CreateScreen = () => (
    <ScrollView>
      <Text style={styles.pageTitle}>Create a post</Text>
      <Text style={styles.pageSubtitle}>Share something with your community.</Text>
      <View style={styles.createCard}>
        <View style={styles.postHeader}>
          <Avatar name={name} />
          <Text style={styles.personName}>{name}</Text>
        </View>
        <TextInput
          style={styles.captionInput}
          placeholder="What would you like to share?"
          placeholderTextColor={C.muted}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
        <Button title="Publish post" onPress={addPost} />
      </View>
    </ScrollView>
  );

  const MessagesScreen = () => (
    <View>
      <Text style={styles.pageTitle}>Messages</Text>
      <Text style={styles.pageSubtitle}>Your conversations.</Text>
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>✉</Text>
        <Text style={styles.cardTitle}>Messages coming soon</Text>
        <Text style={styles.mutedText}>
          Private messaging will be available when the messaging service is connected.
        </Text>
      </View>
    </View>
  );

  const NotificationsScreen = () => (
    <View>
      <Text style={styles.pageTitle}>Notifications</Text>
      <Text style={styles.pageSubtitle}>Stay updated with your community.</Text>
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>♢</Text>
        <Text style={styles.cardTitle}>You're all caught up</Text>
        <Text style={styles.mutedText}>
          New activity notifications will appear here.
        </Text>
      </View>
    </View>
  );

  const ProfileScreen = () => (
    <ScrollView>
      <Text style={styles.pageTitle}>My Profile</Text>
      <View style={styles.profileCard}>
        <Avatar name={name} size={82} />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.mutedText}>{email || 'WorldLink member'}</Text>
        <View style={styles.badgeRow}>
          <Badge label="MEMBER" color={C.blue} />
          <Badge label="CREATOR" color={C.purple} />
          <Badge label="COMMUNITY" color={C.green} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{posts.filter(p => p.name === name).length}</Text>
            <Text style={styles.mutedText}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{following.length}</Text>
            <Text style={styles.mutedText}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.mutedText}>Followers</Text>
          </View>
        </View>
      </View>

      <SectionTitle title="Account settings" />
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setPrivateAccount(!privateAccount)}
      >
        <Text style={styles.settingText}>Private account</Text>
        <Text style={styles.settingValue}>{privateAccount ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => Alert.alert('Blocked accounts', blocked.length ? blocked.join(', ') : 'No blocked accounts.')}
      >
        <Text style={styles.settingText}>Blocked accounts</Text>
        <Text style={styles.settingValue}>{blocked.length} ›</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => Alert.alert('About WorldLink', 'WorldLink — Connect beyond borders.')}
      >
        <Text style={styles.settingText}>About WorldLink</Text>
        <Text style={styles.settingValue}>›</Text>
      </TouchableOpacity>
      <Button title="Log out" secondary onPress={logout} />
    </ScrollView>
  );

  const BuyDataScreen = () => (
    <ScrollView>
      <Text style={styles.pageTitle}>Buy Data</Text>
      <Text style={styles.pageSubtitle}>Explore mobile data services.</Text>
      <View style={styles.buyDataLarge}>
        <Text style={styles.buyDataIcon}>◈</Text>
        <Text style={styles.cardTitle}>Stay connected with WorldLink</Text>
        <Text style={styles.mutedText}>
          Data bundles and payments will become available after a verified mobile-network and payment provider is connected.
        </Text>
      </View>
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Service information</Text>
        <Text style={styles.mutedText}>
          This is currently a preview screen. No payment or data purchase is processed in this demo.
        </Text>
      </View>
      <Button title="Back to Home" onPress={() => goTab('Home')} />
    </ScrollView>
  );

  const renderScreen = () => {
    if (tab === 'Home') return <HomeScreen />;
    if (tab === 'Discover') return <DiscoverScreen />;
    if (tab === 'Create') return <CreateScreen />;
    if (tab === 'Messages') return <MessagesScreen />;
    if (tab === 'Profile') return <ProfileScreen />;
    if (tab === 'Notifications') return <NotificationsScreen />;
    if (tab === 'Buy Data') return <BuyDataScreen />;
    return <HomeScreen />;
  };

  if (screen === 'Login') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <KeyboardAvoidingView
          style={styles.loginContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>W</Text>
          </View>
          <Text style={styles.loginBrand}>WorldLink</Text>
          <Text style={styles.loginTagline}>Connect beyond borders</Text>

          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome back</Text>
            <Text style={styles.pageSubtitle}>Sign in to your community</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={C.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={C.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Log in" onPress={login} />
            <TouchableOpacity onPress={register} style={styles.registerLink}>
              <Text style={styles.linkText}>Create demo account</Text>
            </TouchableOpacity>
            <Text style={styles.demoNote}>
              Demo interface only. Real account authentication requires a secure backend.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Header />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {tab !== 'Buy Data' && tab !== 'Notifications' && <BottomNav />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: C.white,
    fontSize: 25,
    fontWeight: '900',
  },
  brand: {
    color: C.white,
    fontSize: 19,
    fontWeight: '900',
  },
  tagline: {
    color: C.muted,
    fontSize: 10,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    color: C.white,
    fontSize: 25,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.red,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  welcomeSmall: {
    color: C.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  welcomeTitle: {
    color: C.white,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 8,
  },
  welcomeDescription: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 12,
  },
  buyDataCard: {
    backgroundColor: '#172A50',
    borderColor: C.blue,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  buyDataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  buyDataIcon: {
    color: C.green,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  buyDataTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '900',
  },
  buyDataDescription: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: '800',
  },
  linkText: {
    color: '#65A5FF',
    fontSize: 13,
    fontWeight: '800',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
  },
  storyRing: {
    padding: 3,
    borderWidth: 2,
    borderColor: C.purple,
    borderRadius: 40,
  },
  storyName: {
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
  },
  postCard: {
    backgroundColor: C.surface,
    borderRadius: 17,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: C.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postIdentity: {
    flex: 1,
    marginLeft: 10,
  },
  personName: {
    color: C.white,
    fontWeight: '800',
    fontSize: 13,
  },
  mutedText: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 17,
  },
  moreIcon: {
    color: C.muted,
    fontSize: 18,
  },
  postText: {
    color: '#E2E9FA',
    fontSize: 14,
    lineHeight: 21,
    marginVertical: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
  },
  actionText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  avatar: {
    backgroundColor: '#283F75',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#5C83D7',
  },
  avatarText: {
    color: C.white,
    fontWeight: '900',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginHorizontal: 3,
    marginVertical: 4,
    backgroundColor: C.surface,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pageTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 5,
  },
  pageSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 17,
  },
  input: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
    color: C.white,
    marginBottom: 13,
    fontSize: 14,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  personIdentity: {
    flex: 1,
    marginLeft: 10,
  },
  followButton: {
    backgroundColor: C.blue,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
  },
  followingButton: {
    backgroundColor: '#253654',
  },
  followButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyText: {
    color: C.muted,
    textAlign: 'center',
    marginTop: 25,
  },
  createCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  captionInput: {
    minHeight: 150,
    textAlignVertical: 'top',
    color: C.white,
    fontSize: 15,
    marginVertical: 15,
  },
  emptyCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 15,
  },
  emptyIcon: {
    color: C.blue,
    fontSize: 38,
    marginBottom: 12,
  },
  cardTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  profileName: {
    color: C.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 18,
    paddingTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: C.white,
    fontSize: 18,
    fontWeight: '900',
  },
  settingRow: {
    backgroundColor: C.surface,
    borderRadius: 13,
    padding: 16,
    marginBottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  settingText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },
  settingValue: {
    color: C.blue,
    fontWeight: '800',
  },
  buyDataLarge: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 15,
  },
  noticeCard: {
    backgroundColor: C.surface,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  noticeTitle: {
    color: C.white,
    fontWeight: '900',
    marginBottom: 8,
  },
  button: {
    backgroundColor: C.blue,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: C.white,
    fontWeight: '900',
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.red,
    marginTop: 16,
  },
  secondaryButtonText: {
    color: C.red,
  },
  bottomNav: {
    height: 68,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    color: C.muted,
    fontSize: 21,
    fontWeight: '800',
  },
  navLabel: {
    color: C.muted,
    fontSize: 9,
    marginTop: 3,
  },
  activeNavText: {
    color: '#65A5FF',
    fontWeight: '900',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },
  loginLogo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loginLogoText: {
    color: C.white,
    fontSize: 44,
    fontWeight: '900',
  },
  loginBrand: {
    color: C.white,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },
  loginTagline: {
    color: C.muted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25,
  },
  loginCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  loginTitle: {
    color: C.white,
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 5,
  },
  registerLink: {
    alignItems: 'center',
    padding: 15,
  },
  demoNote: {
    color: C.muted,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default App;

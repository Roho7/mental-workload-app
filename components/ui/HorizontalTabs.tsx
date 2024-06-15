import {
  H5,
  Separator,
  SizableText,
  StackProps,
  Tabs,
  TabsContentProps,
  YStack,
} from 'tamagui';

const TabsRovingIndicator = ({
  active,
  ...props
}: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor="$color5"
      opacity={0.7}
      animation="100ms"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  );
};

export const HorizontalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width={400}
      height={150}
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
      caretColor="#0362FF"
    >
      <TabsRovingIndicator borderRadius="$4" width={40} height={20} />
      <Tabs.List
        separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
        backgroundColor="#0362FF"
      >
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Daily</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Weekly</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab3">
          <SizableText fontFamily="$body">Monthly</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator />
      <TabsContent value="tab1">
        <H5>Profile</H5>
      </TabsContent>

      <TabsContent value="tab2">
        <H5>Connections</H5>
      </TabsContent>

      <TabsContent value="tab3">
        <H5>Notifications</H5>
      </TabsContent>
    </Tabs>
  );
};

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
};

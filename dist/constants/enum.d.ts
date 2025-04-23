export declare enum ListPageView {
    Dashboard = "Dashboard Page",
    Activities = "Activities Page",
    Report = "Reports Page",
    Contacts = "Contacts Page",
    Companies = "Companies Page",
    Deals = "Deals Page"
}
export declare enum NavItems {
    Settings = "Settings Page",
    QuickAdd = "Quick add",
    ProfileImage = "Profile Picture",
    Notification = "Notification",
    Search = "Search"
}
export declare enum NoteActionViews {
    Notes = "Notes view",
    Appointment = "Appointments view",
    Task = "Tasks view",
    AssociateDeal = "Associate Deal view",
    AssociateContact = "Associate Contact view",
    AssociateCompany = "Associate Company view",
    AddNotes = "Add Notes"
}
export declare enum DetailsQuickIcons {
    SendMail = "Send Mail",
    Appointment = "Add Appointment",
    Task = "Add Task",
    AssociateDeal = "Add Associate Deal",
    AssociateContact = "Add Associate Contact",
    AssociateCompany = "Add Associate Company"
}
export declare enum FooterModule {
    SendMail = "Send Mail",
    AssignTo = "Assign To",
    ExportContact = "Export Contact",
    ExportCompany = "Export Company",
    ExportDeal = "Export Deal",
    DealWon = "Deal Won",
    DealLost = "Deal Lost",
    Task = "Add Task",
    Delete = "Delete",
    Export = "Export",
    ModalDelete = "Open Delete Modal",
    CancelClick = "Close Footer",
    ActivityEdit = "Edit Activity",
    ActivityDeleteModal = "Delete Activity Modal",
    Edit = "Edit"
}
export declare enum ExportImports {
    Export = "Export clicked",
    Import = "Import clicked",
    ImportHistory = "Import History clicked"
}
export declare enum MailReplies {
    Reply = "Reply",
    ReplyAll = "Reply All",
    Forward = "Forward"
}
export declare enum RestoreAccount {
    DefaultAccount = "Restore Default Account"
}
export declare enum AddOrRemoveView {
    AddToView = "Add To View",
    RemoveFromView = "Remove From View"
}
export declare enum AddObjectTypes {
    AddContact = "Add Contact",
    AddCompany = "Add Company",
    AddDeal = "Add Deal",
    Add = "Add"
}
export declare enum CreateObjectTypes {
    CreateContact = "Create Contact",
    CreateCompany = "Create Company",
    CreateDeal = "Create Deal"
}
export declare enum CreateAddNew {
    CreateContact = "Create and add new contact",
    CreateCompany = "Create and add new company",
    CreateDeal = "Create and add new deal"
}
export declare enum ObjectCreateCanceled {
    CancelCreateContact = "Cancel create contact",
    CancelCreateCompany = "Cancel create company",
    CancelCreateDeal = "Cancel create deal"
}
export declare enum ActivityTrack {
    AddActivity = "Add Activity",
    AddAppointment = "Add Appointment",
    AddTask = "Add Task",
    AllActivity = "View All Activity",
    AllTask = "View All Task",
    ALlAppointment = "View All Appointment",
    EditColumn = "Edit Columns"
}
export declare enum ActivityFilters {
    ToDo = "TO DO Activities",
    Today = "Today Activities",
    Completed = "Completed Activities",
    OverDue = "Overdue Activities",
    ThisWeek = "This Week Activities",
    NextWeek = "Next Week Activities",
    StartEndFilter = "Date Based Activities filter"
}
export declare enum MoreVertActions {
    ViewAllFields = "View all fields",
    EditAction = "Edit",
    DeleteAction = "Delete"
}
export declare enum RouteProfileActions {
    Settings = "Settings Page",
    PrivacyPolicy = "Privacy Policy",
    SignOut = "Sign out"
}
export declare enum ManageCustomize {
    CustomizeFields = "Customize Fields",
    EditColumn = "Edit Columns",
    ManageFields = "Manage Fields",
    ClearFieldSearch = "Clear Manage Field Search",
    EditPipeline = "Edit Pipeline"
}
export declare enum ManageFilters {
    MoreFilter = "More Filter",
    ManageSavedFilter = "Manage Saved Filter",
    ClearFilter = "Clear Filter",
    ApplyFilter = "Apply Filter"
}
export declare enum SettingUserManagement {
    AddTeam = "Create Team",
    AddUser = "Add User",
    AddRole = "Add Role"
}
export declare enum DataFieldsSetting {
    CreateField = "Create Field",
    CreateGroup = "Create Group"
}
export declare enum OpenModal {
    InviteNewUser = "Invite New User",
    ContactAssignToCancel = "Contact Assign To Cancel",
    CompanyAssignToCancel = "Company Assign To Cancel",
    DealAssignToCancel = "Deal Assign To Cancel",
    AssignOwner = "Assign User",
    Delete = "Delete Modal",
    Deleted = "Deleted",
    DeleteContact = "Contact Deleted",
    DeleteCompany = "Company Deleted",
    DeleteDeal = "Deal Deleted",
    DeleteContactCancel = "Delete Contact Cancel",
    DeleteCompanyCancel = "Delete Company Cancel",
    DeleteDealCancel = "Delete Deal Cancel",
    DeleteActivity = "Activity Deleted",
    DeleteActivityCancel = "Cancel Delete Activities modal",
    WonButton = "Won",
    LostButton = "Lost"
}
export declare enum ReportsSection {
    UserFilter = "Filter Report by Users",
    ExportReports = "Export Reports",
    RangeFilter = "Filter Reports by Range"
}
export declare enum DashboardSection {
    DashboardRangeFilter = "Filter Dashboard activities by range",
    UserFilter = "Filter Dashboard activities by users"
}
export type MixPanelEnumType = ListPageView | NavItems | NoteActionViews | DetailsQuickIcons | FooterModule | ExportImports | MailReplies | RestoreAccount | AddOrRemoveView | AddObjectTypes | CreateObjectTypes | CreateAddNew | ObjectCreateCanceled | ActivityTrack | ActivityFilters | MoreVertActions | RouteProfileActions | ManageCustomize | ManageFilters | SettingUserManagement | DataFieldsSetting | OpenModal | ReportsSection | DashboardSection;
export declare enum ObjectCreateDrawerStep {
    ONE = 0,
    TWO = 1,
    THREE = 2,
    FOUR = 3
}
export declare enum PrivilageModuleEnum {
    contact = "contacts",
    deal = "deals"
}
export declare enum FieldTypes {
    SingleLine = "single-line",
    MultiLine = "multi-line",
    DropDown = "drop-down",
    MultiSelect = "multi-select",
    Number = "number",
    Currency = "currency",
    DatePicker = "date-picker",
    Priority = "priority",
    Email = "email",
    Website = "website",
    PhoneNumber = "phone-number",
    User = "user",
    Files = "file",
    Collaborators = "collaborators"
}
export declare enum SocketConnectionStrings {
    RegisterWorkspace = "registerWorkspace",
    TenantStatus = "tenantStatus"
}
export declare enum CustomType {
    SingleLine = "single-line",
    MultiLine = "multi-line",
    Number = "number",
    Currency = "currency",
    Dropdown = "drop-down",
    MultiSelect = "multi-select",
    DatePicker = "date-picker",
    Priority = "priority",
    User = "user",
    PhoneNumber = "phone-number",
    File = "file",
    Email = "email",
    Website = "website",
    Collaborators = "collaborators"
}
export declare enum RelationshipType {
    OneToOne = 1,
    OneToMany = 2,
    ManyToOne = 3
}
export declare enum KEYBOARD_KEYS {
    enter = "Enter"
}
export declare enum COOKIE_POSSIBLE_KEYS {
    AccessToken = "accessToken",
    LastAuthUser = "LastAuthUser",
    RefreshToken = "refreshToken",
    UserData = "userData",
    IdToken = "idToken"
}
export declare enum LanguageListKey {
    English = "en",
    Spanish = "es",
    Tamil = "ta",
    French = "fr"
}
export declare enum LanguageList {
    English = "English",
    Spanish = "Spanish",
    Tamil = "Tamil",
    French = "French"
}
export declare enum DataActions {
    sort = "sort",
    filter = "filter"
}
export declare enum ComposeType {
    draft = "draft",
    reply = "reply",
    replyall = "replyall",
    forward = "forward"
}
export declare enum EmailStatus {
    sent = "sent",
    scheduled = "scheduled",
    draft = "draft"
}
export declare enum EmailAction {
    reply = "reply",
    replyall = "replyall",
    forward = "forward",
    cancelSchdule = "cancel-schedule",
    moveToInbox = "move-to-inbox",
    moveToTrash = "delete",
    deleteForever = "delete-forever"
}
export declare enum EmailTabs {
    inbox = "inbox",
    sent = "sent",
    scheduled = "scheduled",
    draft = "drafts",
    trash = "trash"
}
export declare enum ActivityType {
    RECORD = "RECORD",
    MAIL = "MAIL",
    TASK = "TASK",
    MEETING = "MEETING",
    NOTE = "NOTE"
}
export declare enum ActionType {
    CREATE = "CREATE",
    ADD = "ADD",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    CONNECTROMOVE = "CONNECTROMOVE",
    ADDFILES = "ADDFILES",
    DELETEFILES = "DELETEFILES"
}

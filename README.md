workshop
========

Cooperative API building

Data Structure for a project

Commit
    - uuid
    - date
    - Tree (project root)

Tree (endpoint grouping?)
    - List<Tree,Leaf>

Leaf (endpoint?)
    - Name
    - Description
    - Method(s)
    - Request
    - Response

Request
    - Query (List<Parameter>)
    - Payload (Raw(String Description) | QueryList<Parameter>)
    - Multipart

Response
    - Body (Raw(String Description) | FormattedList<Parameter>)

Parameter
    Number
        Int
            Unsigned
        Float
            Unsigned
        String
        Boolean

List
    - FormattedList
        + QueryList
        + Json
        + XML (let's not go there)

Multipart
    - Constraint (Name(size), Range)

Range
    - NumericRange (min, max)
    - InRange (a... n)

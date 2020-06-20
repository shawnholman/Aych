import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

/**
 * The Group class renders a set of Renderable one after the other.
 */
export class Group extends Renderable {
    private members: Renderable[] = [];

    /**
     * Constructor
     * @param members A set of one or more members to add to the group.
     */
    constructor(...members: (Renderable|string)[]) {
        super();
        
        if (members.length > 0) {
            this.setMembers(...members);
        }
    }

    /** Gets the members. */
    getMembers(): Renderable[] {
        return this.members;
    }

    /**
     * Sets the members.
     * @param members one or more members
     */
    setMembers(...members: (Renderable | string)[]): void {
        for (const member of members) {
            this.addMember(member);
        }
    }

    /**
     * Appends a member.
     * @param member either a string or renderable
     */
    addMember(member: Renderable | string): void {
        if (isString(member)) {
            // empty strings do not require an object made
            if (member.trim().length === 0) {
                return;
            } else {
                member = new StringLiteral(member);
            }
        }
        this.members.push(member);
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        // Go through all of the members and render them one next to the other.
        return this.members.reduce((current, next) => {
            return current + next.render(templates);
        }, '');
    }
}
